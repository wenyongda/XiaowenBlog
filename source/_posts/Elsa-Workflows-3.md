---
title: Elsa Workflows 3
date: 2026-06-17 13:21:19
tags:
---

# Elsa Workflows 3 与 Activiti 5.14 对比指南

## 核心架构差异

| 概念 | Activiti 5.14 (Java) | Elsa Workflows 3 (.NET) |
|------|---------------------|------------------------|
| **流程定义** | BPMN 2.0 XML | C# 代码 / JSON / 可视化设计器 |
| **任务模型** | 内置 UserTask 概念 | 阻塞活动 (Blocking Activity) + 书签 (Bookmark) |
| **状态管理** | HistoryService 审计日志 | 自定义审计实现 |
| **回滚支持** | 无原生支持，需自定义 | 有 Alterations API |
| **API 风格** | Java 服务注入 | .NET 依赖注入 |

---

## 功能逐一对比

### 1. 流程定义 (Process Definition)

**Activiti 5.14:**
```java
// 使用 BPMN 2.0 XML 文件
// process.bpmn20.xml
<process id="approvalProcess" name="审批流程" isExecutable="true">
  <startEvent id="start"/>
  <userTask id="review" name="审核" activiti:assignee="${reviewer}"/>
  <endEvent id="end"/>
  <sequenceFlow sourceRef="start" targetRef="review"/>
  <sequenceFlow sourceRef="review" targetRef="end"/>
</process>

// 部署流程定义
repositoryService.createDeployment()
    .addClasspathResource("process.bpmn20.xml")
    .deploy();
```

**Elsa Workflows 3:**
```csharp
// 方式1: C# 代码定义
public class ApprovalWorkflow : Workflow
{
    public override void Build(IWorkflowBuilder builder)
    {
        builder
            .HttpEndpoint("/start-approval", HttpMethod.Post)
            .Then<WaitForApprovalActivity>(activity =>
            {
                activity.ApprovalMessage = new("请审核此申请");
            })
            .WriteHttpResponse(HttpStatusCode.OK, "流程完成");
    }
}

// 方式2: JSON 定义
{
  "definitionId": "approval-workflow",
  "name": "审批流程",
  "version": 1,
  "root": {
    "type": "Elsa.Flowchart",
    "activities": [
      {
        "id": "start",
        "type": "Elsa.HttpEndpoint",
        "path": "/start-approval"
      }
    ]
  }
}

// 方式3: 使用 Elsa Studio 可视化设计器

// 发布流程定义
await workflowDefinitionsApi.SaveAsync(new SaveWorkflowDefinitionRequest
{
    Model = new WorkflowDefinitionModel
    {
        DefinitionId = "approval-workflow",
        Name = "审批流程",
        IsPublished = true
    },
    Publish = true
});
```

---

### 2. 启动一个特定的流程 (Start a Specific Process)

**Activiti 5.14:**
```java
Map<String, Object> variables = new HashMap<>();
variables.put("applicant", "张三");
variables.put("amount", 5000);

ProcessInstance instance = runtimeService
    .startProcessInstanceByKey("approvalProcess", variables);

String processInstanceId = instance.getId();
```

**Elsa Workflows 3:**
```csharp
// 方式1: 直接执行 (同步)
var workflowRunner = serviceProvider.GetRequiredService<IWorkflowRunner>();
var result = await workflowRunner.RunAsync<ApprovalWorkflow>(input: new Dictionary<string, object>
{
    ["Applicant"] = "张三",
    ["Amount"] = 5000
});

// 方式2: 异步调度 (推荐用于生产环境)
var dispatcher = serviceProvider.GetRequiredService<IWorkflowDispatcher>();
await dispatcher.DispatchAsync(new DispatchWorkflowInstanceRequest
{
    DefinitionId = "approval-workflow",
    Input = new Dictionary<string, object>
    {
        ["Applicant"] = "张三",
        ["Amount"] = 5000
    }
});

// 方式3: 通过 HTTP API
// POST /api/workflow-definitions/approval-workflow/dispatch
```

---

### 3. 获取下一流程的流程以及对应审核人列表 (Get Next Tasks and Approvers)

**Activiti 5.14:**
```java
// 获取当前流程实例的任务
List<Task> tasks = taskService.createTaskQuery()
    .processInstanceId(processInstanceId)
    .list();

for (Task task : tasks) {
    System.out.println("任务名称: " + task.getName());
    System.out.println("处理人: " + task.getAssignee());
    System.out.println("创建时间: " + task.getCreateTime());
}

// 获取候选任务 (待认领)
List<Task> candidateTasks = taskService.createTaskQuery()
    .taskCandidateUser("userId")
    .list();
```

**Elsa Workflows 3:**
```csharp
// Elsa 没有内置的"任务"概念，需要通过书签(Bookmarks)实现
// 查询流程实例的书签 (类似当前待处理节点)
var bookmarks = await bookmarkFinder
    .FindByWorkflowInstanceIdAsync(workflowInstanceId);

foreach (var bookmark in bookmarks)
{
    Console.WriteLine($"书签名称: {bookmark.Name}");
    Console.WriteLine($"活动类型: {bookmark.ActivityTypeName}");
    // 自定义: 需要从书签的 Payload 中提取审核人信息
}

// 推荐方案: 使用自定义状态管理
public class ApprovalStateTracker
{
    private readonly IWorkflowInstancesApi _workflowInstancesApi;
    
    public async Task<List<ApprovalStep>> GetNextApproversAsync(
        string workflowInstanceId)
    {
        // 从工作流变量中获取当前步骤和审核人
        var instance = await _workflowInstancesApi.GetAsync(workflowInstanceId);
        var currentStep = instance.Variables["CurrentStep"];
        var approvers = instance.Variables["NextApprovers"] as List<string>;
        
        return new List<ApprovalStep>
        {
            new ApprovalStep
            {
                StepName = currentStep.ToString(),
                Approvers = approvers
            }
        };
    }
}
```

---

### 4. 提交给下一流程至下一个审核人审核 (Submit to Next Approver)

**Activiti 5.14:**
```java
// 认领任务
taskService.claim(taskId, "userId");

// 完成任务并传递变量
Map<String, Object> variables = new HashMap<>();
variables.put("approved", true);
variables.put("comment", "同意申请");

taskService.complete(taskId, variables);
```

**Elsa Workflows 3:**
```csharp
// 方式1: 通过书签ID恢复
var input = new Dictionary<string, object>
{
    ["Decision"] = "Approved",
    ["ApprovedBy"] = "manager@example.com",
    ["Comment"] = "同意申请"
};

var result = await workflowResumer.ResumeAsync(bookmarkId, input);

// 方式2: 通过 Stimulus (匹配书签)
var stimulus = new
{
    ApprovalId = approvalId,
    StepName = "ManagerReview"
};

await workflowResumer.ResumeAsync(stimulus, input);

// 方式3: 通过 HTTP API (使用令牌URL)
// POST /elsa/api/bookmarks/resume?t=ENCRYPTED_TOKEN
// Body: { "input": { "Decision": "Approved", "ApprovedBy": "manager@example.com" } }

// 自定义审核活动示例
public class WaitForApprovalActivity : Activity
{
    protected override async ValueTask ExecuteAsync(
        ActivityExecutionContext context)
    {
        var bookmarkArgs = new CreateBookmarkArgs
        {
            BookmarkName = "WaitForApproval",
            Payload = new Dictionary<string, object>
            {
                ["ApprovalId"] = context.Get(ApprovalId),
                ["CurrentStep"] = context.Get(CurrentStep)
            },
            Callback = OnApprovalReceivedAsync,
            AutoBurn = true // 使用一次后自动销毁
        };

        context.CreateBookmark(bookmarkArgs);
    }

    private async ValueTask OnApprovalReceivedAsync(
        ActivityExecutionContext context)
    {
        var decision = context.WorkflowInput["Decision"];
        var approvedBy = context.WorkflowInput["ApprovedBy"];
        
        // 记录审核历史
        await RecordApprovalHistoryAsync(decision, approvedBy);
        
        // 根据决策决定下一步
        if (decision.ToString() == "Approved")
        {
            await context.CompleteActivityWithOutcomesAsync("Approved");
        }
        else
        {
            await context.CompleteActivityWithOutcomesAsync("Rejected");
        }
    }
}
```

---

### 5. 获取退回到之前流程以及对应审核人列表 (Get Previous Tasks for Rollback)

**Activiti 5.14:**
```java
// 获取历史任务
List<HistoricTaskInstance> historicTasks = historyService
    .createHistoricTaskInstanceQuery()
    .processInstanceId(processInstanceId)
    .orderByHistoricTaskInstanceEndTime().desc()
    .list();

for (HistoricTaskInstance task : historicTasks) {
    System.out.println("任务名称: " + task.getName());
    System.out.println("处理人: " + task.getAssignee());
    System.out.println("开始时间: " + task.getStartTime());
    System.out.println("结束时间: " + task.getEndTime());
}
```

**Elsa Workflows 3:**
```csharp
// 需要自定义审计日志实现
public class WorkflowAuditService
{
    private readonly IAuditLogRepository _auditLogRepo;
    
    public async Task<List<AuditEntry>> GetApprovalHistoryAsync(
        string workflowInstanceId)
    {
        return await _auditLogRepo
            .GetByWorkflowInstanceIdAsync(workflowInstanceId);
    }
    
    public async Task RecordApprovalAsync(
        string workflowInstanceId,
        string stepName,
        string approver,
        string decision,
        string comment)
    {
        await _auditLogRepo.AddAsync(new AuditEntry
        {
            WorkflowInstanceId = workflowInstanceId,
            StepName = stepName,
            Approver = approver,
            Decision = decision,
            Comment = comment,
            Timestamp = DateTime.UtcNow
        });
    }
}

// 在审核活动的回调中记录历史
private async ValueTask OnApprovalReceivedAsync(
    ActivityExecutionContext context)
{
    var decision = context.WorkflowInput["Decision"];
    var approvedBy = context.WorkflowInput["ApprovedBy"];
    
    // 记录审核历史
    await _auditService.RecordApprovalAsync(
        context.WorkflowExecutionContext.Id,
        context.Get(CurrentStep),
        approvedBy.ToString(),
        decision.ToString(),
        context.WorkflowInput["Comment"]?.ToString());
    
    // 继续流程...
}
```

---

### 6. 退回到之前流程及其对应的审核人 (Rollback to Previous Task)

**Activiti 5.14:**
```java
// 方案1: 使用流程变量 + 网关循环
// 在 BPMN 中设计回退路径
// 需要在 BPMN XML 中定义循环逻辑

// 方案2: 使用信号事件
runtimeService.signalEventReceived("rollbackSignal", variables);

// 方案3: 自定义命令 (不推荐，侵入性强)
```

**Elsa Workflows 3:**
```csharp
// 方案1: 使用 Alterations API (推荐)
await workflowAlterationService.AlterAsync(workflowInstanceId, alteration =>
{
    // 修改工作流变量
    alteration.SetVariable("CurrentStep", "ManagerReview");
    alteration.SetVariable("NeedsRollback", true);
});

// 方案2: 取消当前书签，创建新书签
public async Task RollbackToStepAsync(
    string workflowInstanceId,
    string targetStep,
    string targetApprover)
{
    // 1. 获取当前书签
    var bookmarks = await bookmarkFinder
        .FindByWorkflowInstanceIdAsync(workflowInstanceId);
    
    // 2. 取消当前书签 (通过恢复并传递回退指令)
    var input = new Dictionary<string, object>
    {
        ["Decision"] = "Rollback",
        ["TargetStep"] = targetStep,
        ["TargetApprover"] = targetApprover
    };
    
    // 3. 恢复工作流，触发回退逻辑
    await workflowResumer.ResumeAsync(bookmarks.First().Id, input);
}

// 方案3: 使用自定义回退活动
public class RollbackActivity : Activity
{
    protected override async ValueTask ExecuteAsync(
        ActivityExecutionContext context)
    {
        var targetStep = context.Get(TargetStep);
        var targetApprover = context.Get(TargetApprover);
        
        // 更新流程状态
        context.SetVariable("CurrentStep", targetStep);
        context.SetVariable("CurrentApprover", targetApprover);
        
        // 记录回退历史
        await RecordRollbackAsync(targetStep, targetApprover);
        
        // 完成活动，流程将根据条件网关回到目标步骤
        await context.CompleteActivityAsync();
    }
}
```

---

### 7. 流程的完结 (Process Completion)

**Activiti 5.14:**
```java
// 方式1: 自然结束 (所有任务完成)
taskService.complete(lastTaskId);

// 方式2: 手动终止
runtimeService.deleteProcessInstance(processInstanceId, "用户取消");

// 方式3: 结束事件触发
// 在 BPMN 中定义 endEvent
```

**Elsa Workflows 3:**
```csharp
// 方式1: 自然结束 (所有活动完成)
// 当工作流执行到 End 活动时自动结束

// 方式2: 手动取消
var workflowCanceller = serviceProvider.GetRequiredService<IWorkflowCanceller>();
await workflowCanceller.CancelAsync(workflowInstanceId);

// 方式3: 通过 API
// DELETE /api/workflow-instances/{instanceId}

// 方式4: 使用 End 活动
builder
    .Then<SomeActivity>()
    .Then<End>() // 工作流在此结束
    .WriteHttpResponse(HttpStatusCode.OK, "流程已完成");
```

---

## 迁移建议

### 设计模式推荐

对于审批流程场景，建议在 Elsa 中采用以下设计：

```csharp
public class ApprovalWorkflow : Workflow
{
    public override void Build(IWorkflowBuilder builder)
    {
        builder
            // 开始
            .HttpEndpoint("/start", HttpMethod.Post)
            .Then<InitializeApprovalActivity>()
            
            // 审核循环
            .Then<WaitForApprovalActivity>(activity =>
            {
                activity.ApprovalMessage = new("请审核");
            })
            .If(context => context.GetInput<string>("Decision") == "Approved",
                then => then.Then<ProcessApprovedActivity>(),
                @else => @else.Then<ProcessRejectedActivity>())
            
            // 结束
            .WriteHttpResponse(HttpStatusCode.OK);
    }
}

// 状态跟踪服务
public class ApprovalTrackingService
{
    // 记录每个步骤的审核人
    public async Task RecordStepAsync(
        string workflowId,
        ApprovalStep step)
    {
        // 存储到数据库
    }
    
    // 获取历史步骤 (用于回退)
    public async Task<List<ApprovalStep>> GetHistoryAsync(
        string workflowId)
    {
        // 从数据库查询
    }
    
    // 获取下一个审核人
    public async Task<List<string>> GetNextApproversAsync(
        string workflowId)
    {
        // 根据业务规则计算
    }
}
```

---

## 关键差异总结

| 功能 | Activiti | Elsa | 迁移注意事项 |
|------|----------|------|-------------|
| 任务查询 | 原生支持 | 需自定义 | 需要实现状态跟踪服务 |
| 审计日志 | HistoryService | 需自定义 | 需要实现审计日志模块 |
| 回滚 | 无原生支持 | Alterations API | Elsa 有更好的扩展性 |
| 任务分配 | candidateUser/Group | 需自定义 | 需要在书签中存储分配信息 |

---

## 总结

Elsa Workflows 3 作为 .NET 工作流引擎，虽然在任务管理方面不如 Activiti 成熟，但提供了更灵活的扩展机制。迁移过程中需要：

1. **重新设计任务模型**: 使用阻塞活动 + 书签替代内置 UserTask
2. **实现审计服务**: 自定义审核历史记录
3. **利用 Alterations API**: 实现流程回退功能
4. **设计状态管理**: 通过工作流变量跟踪审批状态

整体而言，Elsa 的架构更适合现代 .NET 应用，但需要更多的自定义实现来满足审批流程的完整需求。

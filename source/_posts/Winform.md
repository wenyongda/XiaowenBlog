---
title: Winform
date: 2022-11-18 14:48:31
author: 文永达
top_img: https://gcore.jsdelivr.net/gh/volantis-x/cdn-wallpaper/abstract/B951AE18-D431-417F-B3FE-A382403FF21B.jpeg
---

# Winform

## Net Framework

### 控件属性

#### Name

表示控件名

```c#
this.button1.Name = "button1";
```

#### Text

表示控件文本显示

```c#
this.button.Text = "button1";
```

### 控件事件

#### button按钮

##### click

#### comboBox

##### SelectedIndexChanged

问题：SelectedIndexChanged控件，初始加载的时候总会进去两次，SelectedValue 值总为System.Data.DataRowView。

原因：最后才发现自己是先绑定数据源，后设置控件ValueMember和DisplayMember属性。

解决办法：正确的做法是先设置这两个属性，后绑定数据源。

##### 绑定数据源

```c#
DataTable dt = new DataTable();
dt.Columns.Add("ID", typeof(string));
dt.Columns.Add("NAME", typeof(string));

DataRow dr = dt.NewRow();
dr["ID"] = "1";
dr["NAME"] = "NAME1";

dt.Rows.Add(dr);

dr = dt.NewRow();
dr["ID"] = "2";
dr["NAME"] = "NAME2";

dt.Rows.Add(dr);
this.comboBox1.DisplayMember = "NAME";
this.comboBox1.ValueMember= "ID";
this.comboBox1.DataSource = dt;
```



### 控件文本显示国际化

#### 使用资源文件方式

在解决方案根目录新建`App_GlobalResources`文件夹

新建 `Resource.en-US.resx` 资源文件

放置英文文本

新建 `Resource.resx`资源文件

放置默认简体中文文本

根目录新建 `ResourceCulture.cs`类

```c#
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Resources;
using System.Text;
using System.Threading;

namespace WindowsFormsApp1
{
    public class ResourceCulture
    {
        // 设置需要的语言文本资源文件
        public static void SetCurrentCulture(string name)
        { 
            if (string.IsNullOrEmpty(name))
            {
                name = "en-US";
            }
            Thread.CurrentThread.CurrentCulture = new System.Globalization.CultureInfo(name);
        }
		// 获取资源文件中的文本
        public static string GetString(string id)
        {
            string strCurLanguage = "";
            try
            {
                ResourceManager rm = new ResourceManager("WindowsFormsApp1.App_GlobalResources.Resource",
                    System.Reflection.Assembly.GetExecutingAssembly());
                CultureInfo ci = Thread.CurrentThread.CurrentCulture;

                strCurLanguage = rm.GetString(id, ci);
            }
            catch
            {
                strCurLanguage = "No id" + id + ", please add.";
            }
            return strCurLanguage;
        }
    }
}

```

控件里调用

新建initRes()方法

```c#
private void initRes()
{

    // 设置 窗体form 名称
    this.Text = ResourceCulture.GetString("Form1_frmText");
    // 设置 分组框 groupbox 名称
    this.gbLanguageView.Text = ResourceCulture.GetString("gbLanguageView_frmText");
    this.gbLanguageSelection.Text = ResourceCulture.GetString("gbLanguageSelection_frmText");
}
```

可以在窗体初始化调用加载

```c#
private void Form1_Load(object sender, EventArgs e)
{

    this.initRes();
}
```

如果是一个切换语言的窗体

新建可以切换的控件，这里使用`RadioButton`，因为是中英文切换，所以需要建两个`RadioButton`

使用`click`事件

```c#
 private void radioButton1_CheckedChanged(object sender, EventArgs e)
 {
     ResourceCulture.SetCurrentCulture("en-US");
     this.SetResourceCulture();
 }

private void radioButton2_CheckedChanged(object sender, EventArgs e)
{
    ResourceCulture.SetCurrentCulture("zh-CN");
    this.SetResourceCulture();
}
```

## Net Core

### 打开其他窗体的三种方式

#### Show

例如登入界面进入主页面，直接将主页面展示出来，两个窗体互不影响

```c#
public partial class Form1 : Form
{
    public Form1()
    {
        InitializeComponent();
    }

    private void button1_Click(object sender, EventArgs e)
    {
        Form2 form2 = new Form2();
        form2.Show();
    }
}
```

#### Owner

例如text文件中的“替换”选项，打开界面后不关闭也是允许操作主页面的

```c#
public partial class Form1 : Form
{
    public Form1()
    {
        InitializeComponent();
    }

    private void button1_Click(object sender, EventArgs e)
    {
        Form2 form2 = new Form2();
        form2.Owner = this;
        form2.Show();
    }
}
```

#### ShowDialog

例如text文件中的“打开”选项，打开界面后不关闭是不允许操作主页面的

### 让子窗体显示在父窗体之上

```c#
public partial class Form1 : Form
{
    public Form1()
    {
        InitializeComponent();
    }

    private void button1_Click(object sender, EventArgs e)
    {
        Form2 form2 = new Form2();
        form2.Show(this); // this代表父窗体也就是Form1
    }
}
```

### TextBox

#### 属性

##### Multiline 

控制编辑控件的文本是否能够跨越多行。

##### ScrollBars

指示对于多行编辑控件，将为此控件显示哪些滚动条

##### WordWrap

指示多行编辑控件是否自动换行

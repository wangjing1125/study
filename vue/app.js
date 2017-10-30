/**
 * Created by 35488 on 2017/9/19.
 */
//存取localstorage数据
 var store={
     save(key,value){     //存值
       localStorage.setItem(key,JSON.stringify(value));
     },
    fetch(key){           //取值
      return JSON.parse(localStorage.getItem(key)) || [];
    }
};

/*var list=[
    {
        title:'吃饭打豆豆',
        ischecked:false   //未选中
    },
    {
        title:'吃饭打豆豆',
        ischecked:true   //选中
    }
];*/
var filer={    //列表过滤的三种情况
    all:function (list) {    //全部任务
        return list;
    },
    unfinished:function (list) {     //未完成的任务
        return list.filter(function (item) {
            return !item.ischecked;
        })
    },
    finished:function () {        //完成的任务
        return list.filter(function (item) {
            return item.ischecked;
        })
    }
};


var list=store.fetch("miaov");

var vm = new Vue({
    el:'.main',
    data:{
        list:list,
        todo:"",
        edtorTodos:"",   //记录正在编辑的数据
        beforeTitle:"" ,  //记录编辑之前的数据
        visibility:"all"   //记录列表的hash值
    },
    watch:{
      list:{
          handler:function () {
              store.save("miaov",this.list);
          },
          deep:true
      }
    },
    computed:{
      nocheckedLength:function () {      //计算未完成的任务数量
          return this.list.filter(function (item) {
              return !item.ischecked;
          }).length;
      },
        filterList:function () {
          //如果hash值存在返回过滤的列表  如果输入的hash值不存在 返回全部列表
            return filer[this.visibility] ? filer[this.visibility](list):list;
        }
    },
    methods:{
        addTodo(){       //添加任务
            this.list.push({
                title:this.todo,
                ischecked:false
                }
            );
            this.todo='';
        },
        deleteTodo(todo){        //删除任务
            var index=this.list.indexOf(todo);
             this.list.splice(index,1);
        },
        edtorTodo(todo){         //编辑任务
            this.edtorTodos=todo;
            this.beforeTitle=todo.title;
        },
        edtorTodoed(todo){   //保存任务
           this.edtorTodos='';
        },
        cancelTodo(todo){    //取消编辑
            todo.title=this.beforeTitle;
            this.edtorTodos='';
        }
    },
    directives:{
      "foucs":{
          update(el,binding){
              if(binding.value){
                  el.focus();
              }
          }
      }
    }
});

function watchhashChange() {
    var hash=window.location.hash.slice(1);
    vm.visibility=hash;
    console.log(hash);
}
watchhashChange();

window.addEventListener("hashchange",watchhashChange);
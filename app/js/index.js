;(function() {
    //获取音乐按钮的div
    var autiobtn = document.getElementsByClassName('audio')[0];


    var addClass = function(ele, strClass) {
        var reg = new RegExp("(^| )" + strClass + "( |$)");
        if (reg.test(ele.className)) {
        } else {
            ele.className = ele.className.trim() + " " + strClass;
        }
    };

    var removeClass = function(ele, strClass) {
        if (!(ele && ele.nodeType == 1)) {
            throw new Error('第一参数ele需要是一个DOM元素对象');
        }
        if (typeof strClass != 'string') {
            throw new Error('第二参数必须为string类型');
        }
        var reg = new RegExp("(?:^| )" + strClass + "(?: |$)", "g");
        ele.className = ele.className.replace(reg, '').trim();
    };

    //给音乐按钮添加点击事件
    autiobtn.onclick = function() {
        //获取audio标签
        var audio = document.getElementById('media');
        //如果他是暂停的，让他播放，否则暂停，移除class（rotate）
        if(audio!==null){
            if(audio.paused){
                audio.play();
                addClass(autiobtn, 'rotate');
            }else{
               audio.pause();
               removeClass(autiobtn, 'rotate');
            }
        }
    };

})();

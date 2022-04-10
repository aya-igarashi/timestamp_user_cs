    document.getElementById("login").onclick = function(){
        
   
      const textBox1 = document.getElementById('username'); // テキストボックス
      const user_name = textBox1.value; //テキストボックスに書かれた内容
      const textBox2 = document.getElementById('password') //テキストボックス
      const user_pass = textBox2.value; //テキストボックスに書かれた内容
      const user_np = [user_name,user_pass];
      console.log(user_np);
       
   
      const url = '/admin'; // 通信先
      const req = new XMLHttpRequest(); // 通信用オブジェクト
      req.open('POST', url, true);
      req.setRequestHeader('Content-Type', 'application/json');
      req.send(JSON.stringify(user_np)); // オブジェクトを文字列化して送信
      const s="ffff"
      console.log(s);
      req.onreadystatechange = function(){
        console.log("a");
        if(req.readyState == 4 && req.status == 200) {
          console.log(req.response);
          const result = JSON.parse(req.response);
        
          if(!result){
            document.getElementById("nulltext").value= "認証できませんでした";
          }          
        }
      };      
    };
    
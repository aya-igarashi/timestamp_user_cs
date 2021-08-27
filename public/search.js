document.getElementById("toform").onclick = function(){
  // ログイン処理
  
  // 成功した場合はページ遷移
  location.href = "/toform";
};

document.getElementById("tosearch").onclick = function(){
  // ログイン処理
          const tbody = document.getElementById('tbody'); 

        const url = '/find'; // 通信先
        const req = new XMLHttpRequest(); // 通信用オブジェクト
        req.onreadystatechange = function(){
         if(req.readyState == 4 && req.status == 200) {
          const results = JSON.parse(req.response);   
           
          for(let i in results) {
            const tr = document.createElement('tr');
            const td_junle = document.createElement('td');
            td_junle.innerHTML = results[i].junle;
            const td_name = document.createElement('td');
            td_name.innerHTML = results[i].name;    
            const td_hp = document.createElement('td');
            td_hp.innerHTML = results[i].hp;
            tr.appendChild(td_junle);
            tr.appendChild(td_name);
            tr.appendChild(td_hp);
            tbody.appendChild(tr);
          }
         }
          };
          while(tbody.firstChild) tbody.removeChild(tbody.firstChild);

        req.open('GET', url, true);
        req.send();
  
  // 成功した場合はページ遷移
};


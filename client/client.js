
console.log('testing');

const form = document.querySelector('form'); //selects the form class from html
const loadingELement = document.querySelector('.loading'); //selects the loading class from html
const infoElement = document.querySelector('.info');         // selects the info class from html
const API_URL = 'http://localhost:5000/testing';      // variable to hold the server that i make a request to(making a post request against this url to send the 'dados' object to dynamic server '5000')



loadingELement.style.display = ''; //hiding the loading gif(once the page loads)

listAllInfo()                   //listing all the objects(defined way below)



form.addEventListener('submit', (event) => {  //listen from when the user submits
    event.preventDefault();                    // prevents the page from trying to sent data somewhere
    const formData = new FormData(form);        // grab data from the page(FormData is built into the web browser)(passing reference to form)
    const name = formData.get('name');           // grabs the name(based on html)
    const content = formData.get('content');    // grabs the content(based on html)

    const dados = {                             // object with the name and content
        name,
        content,
        
       

    };
    form.style.display = 'none' //hiding the form once its sent(based on the order of the code - top to bottom)
    loadingELement.style.display = '' // showing the loading gif
    
    fetch(API_URL, {                    //  send the data to the backend server(index.js) which is received and parsed with the POST on the server side
        method: 'POST',                 //method    
        body: JSON.stringify(dados),                  // defining body of the request of the thing we're sending to the server, which is the 'dados' object then converting the javascript object into JSON(something the server can parse and understand)
        headers:{                       // tell what we are sending
            'content-type': 'application/json' // in the body of the request is JSON

        }
    }).then(response => response.json()) //  we get back the response(which we know is json)
      .then(createdInfo => {              // then we get access to the createdInfo
        console.log(createdInfo);
        form.reset();                       // resets the form(makes it blank)
        setTimeout(()=>{
            form.style.display = '';        //shows the form again in 5 seconds
        }, 5000)
                   
        listAllInfo();                      //list all info again after receiving the data(refreshing basically)
        loadingELement.style.display = 'none'; //hides the loading gif

      });  
});
 

function listAllInfo(){
    infoElement.innerHTML = ''   //clear out the array so we can rea add them(blank every object that was there before to re add them) the old objects will stay there if we dont erase and add everything again
    fetch(API_URL)              //(give that data)the way fetch works is if you're making a git request you dont have to specify anything unlike the fetch before
    .then(response => response.json()) //then we get back the response
    .then(info =>{                      //then we get the ojects
        console.log(info);              //log all the objects when the page loads
        info.reverse();                 //reverse the elements in the object array
        info.forEach(dados =>{          //iterate over the objects
            const div = document.createElement('div'); // for each object create and element div
            
            
            const header = document.createElement('h3');// create an element h3 for each name
            header.textContent = dados.name;             //  set the content of the header which is info.name(the name inside the object)

            const contents = document.createElement('p');
            contents.textContent = dados.content;
                                                        // createElement does not put it on the page just creates it
            const date = document.createElement('small');
            date.textContent = new Date(dados.created);
            
                                                        
            div.appendChild(header);                    //appending h3 element to the div with the name
            div.appendChild(contents);                  // appending paragraph element to the div with the contents
            div.appendChild(date);
            infoElement.appendChild(div);                // taking the div with the name and the contents(which were appended above) and appending it to the infoElement(the info class)
        });    
        loadingELement.style.display = 'none';              // hide loading gif after the page loads
        });    
    
}
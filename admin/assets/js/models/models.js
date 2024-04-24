
const api = ""
const modules = {}
class Session {
	constructor(){
		document.cookie = "session=false";
		if(!this.get("loggedIn")){
			document.cookie = "token=None"
		}
		if(!this.get("token")){
			document.cookie = "token=false"
		}
		if(!this.get("company")){
			document.cookie = "company=false"
		}
	}
	
	check(session=false){
		return document.cookie
	}
	get(session){
		if(session){
			session = session.replace(" ","");
			let cookie = document.cookie;
			const slits = cookie.split(";");
			for(const slit of slits){
				let sls = slit.split("=");
				
				if( sls[0].replace(" ","") === session){
				
					this.session = sls[1].replace(" ","");
					if(this.session === "false" || this.session === "False" || this.session === "None"){return false}
					return this.session
				}
			}
			return false
		}
		return false;
	}
	set(session){
		document.cookie = session;
	}
	delete(){
		this.set("company=false")
		this.set("token=None")
		this.set("user=false")
		
		console.log(document.cookie)
	}
	toJson(session){
		return JSON.parse(session);
	}
} 

async function fetchFunction(apiUrl, payload, method,nextFunction,header) {
    try {
     
      const session = new Session()
      const options = {
        method: method || 'GET', // Default to GET if method is not provided
        headers: {
          'Content-Type': header || 'application/json', // Set content type to JSON
          "x-auth-token": session.get("user") ? session.get("user") : session.get("token")
        }
      };
  
      if (payload) {
        options.body = JSON.stringify(payload); // Include payload in request body if provided
      }
  
      const response = await fetch(api+apiUrl, options);
    
      const data = await response.json();
      nextFunction(data); // Send data to the next function
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  }
  
function createAlert(data){
    //alert(data.message)
	Swal.fire({
		title: 'Message!',
		text: data.message ? data.message : data,
		icon: 'info',
		confirmButtonText: 'OK'
	  });
}
const addModal = (id)=>{
	let el = `
		<div id=${id} class="modal fade" role="dialog">
		  <div class="modal-dialog">

			<!-- Modal content-->
			<div class="modal-content">
			  <div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" style="position:absolute;right:2%;">&times;</button>
				<h4 class="modal-title">Modal Header</h4>
			  </div>
			  <div class="modal-body" >
				<p>Some text in the modal.</p>
			  </div>
			  <div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal"  >Close</button>
			  </div>
			</div>

		  </div>
		</div>
	`
	return el
}
function editModal(id,titletext,children,settings){
	console.log(id)
	const body =document.getElementById(id);
	
	const title = body.getElementsByClassName("modal-title")
	const el = body.getElementsByClassName("modal-body")
	const footer = body.getElementsByClassName("modal-footer")[0]
	title[0].innerHTML = titletext
	el[0].innerHTML = children()
	el[0].setAttribute("style","width:99%;margin: 0;padding: 0;")
	if(settings !== undefined){
		if(settings.footer !== undefined){
			var ft = document.createElement(settings.footer.element)
			ft.setAttribute("type",settings.footer.type)
			ft.setAttribute("onclick",settings.footer.onclick ? settings.footer.onclick : "close")
			ft.innerText = settings.footer.text ? settings.footer.text : "next"
			console.log(footer.children)
			footer.appendChild(ft)
		}
	}
}
const session = new Session()
console.log(location.pathname)
if(session.get("token") === false && session.get("user") === false){
    
    if(!location.pathname.includes("login") && !location.pathname.includes("register")){
        session.delete()
        window.location.href = "login.html"
    }
    
}
if(location.pathname.includes("logout")){
    const sess = new Session()
    sess.delete()
    location.href = 'login.html'
}
$(document).ready(function(){
	const actions = [
		"Inventory",
		"Coupons",
		"Active Orders",
		"Price Alerts",
		"Logout"
	]
	var menu_items = ""
	actions.map(function(action){
		menu_items += `
		<li><a href="${action.toLowerCase().replace(" ","_")}">${action}</a></li>
		`
	})
	
	const menu = document.getElementById("menu")
	menu.innerHTML += `
	<li class="mm-active">
	<ul aria-expanded="false" class="mm-collapse mm-show">
		<li class="mm-active"><a href="#actions" class="mm-active">Actions</a></li>
	   ${menu_items}
	</ul>
	</li>
	`
	$("body").append(addModal("addAddress"))
	function saveAddress(id,inid,data){
		$('#addAddress').modal('hide'); 
		if(inid !== undefined){
			const val = $("#"+inid).val()
			if(!val.includes(":")){console.warn("Invalid address format passed =>"+val);return}
			console.log(val)
			fetchFunction("/api/models/admin/addInventory/"+id,{update:true,new_address:{lat:val.split(":")[0],lng:val.split(":")[1]}},"post",function(data){
				console.log(data)
				createAlert(data)
			})
		}else{
			fetchFunction("/api/models/admin/addInventory/"+id,{new:true},"post",function(data){
				console.log(data)
				createAlert(data)
			})
		}
	}
	modules.saveAddress = saveAddress
	function deleteOrder(id){
		if(id !== undefined){
			fetchFunction("/api/models/admin/deleteOrder/"+id,{},"post",function(data){
				console.log(data)
				createAlert(data)
			})
		}
	}
	modules.deleteOrder = deleteOrder
	function delivereOrder(id){
		if(id !== undefined){
			fetchFunction("/api/models/admin/delivereOrder/"+id,{},"post",function(data){
				console.log(data)
				createAlert(data)
			})
		}
	}
	modules.deliverOrder = delivereOrder
	function addReview(id,data){
		console.log(id,data)
		if(id !== undefined && data !== undefined){
			fetchFunction("/api/models/admin/editReview/"+id,data,"post",function(data){
				console.log(data)
				createAlert(data)
			})
		}
	}
	modules.addReview = addReview
})

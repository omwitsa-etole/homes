

function addAddress(id){
	const createIn = () => {
		return `<input type="hidden" name="select-address" id="select-address" >
				<div id="map" style="height: 456px; width: 100%;" ></div>	
		`
	}
	editModal("addAddress","Edit order location",createIn,{footer:{element:"button",type:"button",text:"Save current",onclick:`modules.saveAddress(id,"select-address")`}})
	console.log(document.getElementById("map"))
	initMap(null,"map")
}
//
$(document).ready(function(){
	
	found = 0
	var currentorder = location.search.includes("order") ? location.search.replace("?order=","") : null
    fetchFunction("/api/models/admin/getInventory",{},"post",function(datas){
        console.log(datas)
        const orders = datas.orders
		if(currentorder !== null){
			for(var order of orders){
				try{
					let datas = order
					order = order.order
					if(order.invoice._id.toString() === currentorder){
						document.getElementById("inventoryList").innerHTML += `
							<div id="navpills-" class="tab-pane active show" role="tabpanel">
								<div class="card review-table">
									<div class="media align-items-center">
										<img class="me-3 img-fluid rounded" width="90" src=${order.vehicle ? order.vehicle.description.vehicleFiles.split(",")[0] : '/assets/arrivals/default.jpg'} alt="vehicle">
										<div class="media-body d-lg-flex d-block row align-items-center">
											<div class="col-xl-4 col-xxl-5 col-lg-12 review-bx">
												<span class="text-primary d-block">#${order.invoice._id}</span>
												<h3 class="fs-18 text-black font-w600 mb-1">${order.vehicle ? order.vehicle.name : "Vehicle N/A"}</h3>
												<span class="d-block mb-xl-0 mb-3">Paid on ${datas.invoice.complete === true ? new Date(datas.invoice.due) : "Not Paid"}</span>
											</div>
											<div class="col-xl-7 col-xxl-7 col-lg-12 text-dark mb-xl-0 mb-2">
												<p>${order.order.address ? order.order.address.join(" ===> ") : "Not began tracking, edit location" }</p> 
											</div>
										</div>
										<div class="media-footer d-sm-flex d-block align-items-center">
											<div class="me-5 text-xl-center text-start  ms-xl-3 mb-sm-0 mb-3 ms-0">
												<span class="bgl-primary text-primary rounded p-1 ps-2 pe-2 font-w600 fs-12 d-inline-block mb-2 mb-sm-3">{order.book.complete ? "
												ed" : "Transit"}</span>
												<a href="javascript:void(0);" class="btn btn-outline rounded edit me-2 rounded" data-toggle="modal" data-target="#addAddress" onclick="addAddress('${order.order._id}')">Edit location</a>
											</div>
											<div class="edit ms-auto">
												<a href="javascript:void(0);" class="btn btn-outline-success rounded  me-2" onclick="modules.delivereOrder('${order.book._id}')">Mark Delivered</a>
						<a href="javascript:void(0);" class="btn btn-outline-danger rounded" onclick="modules.deleteOrder('${order.book._id}')">Delete</a>
											</div>
										</div>
									</div>
								</div>
								
								
							</div>
							`
						break
					}
				}catch(e){console.log(e)}
			}
		}
        orders.map(function(order){
			let datas = order
			order = order.order
			try{
				document.getElementById("inventoryList").innerHTML += `
				<div id="navpills-" class="tab-pane active show" role="tabpanel">
					<div class="card review-table">
						<div class="media align-items-center">
							<img class="me-3 img-fluid rounded" width="90" src=${order.vehicle ? order.vehicle.description.vehicleFiles.split(",")[0] : '/assets/arrivals/default.jpg'} alt="vehicle">
							<div class="media-body d-lg-flex d-block row align-items-center">
								<div class="col-xl-4 col-xxl-5 col-lg-12 review-bx">
									<span class="text-primary d-block">#${order.invoice._id}</span>
									<h3 class="fs-18 text-black font-w600 mb-1">${order.vehicle ? order.vehicle.name : "Vehicle N/A"}</h3>
									<span class="d-block mb-xl-0 mb-3">Paid on ${datas.invoice.complete === true ? new Date(datas.invoice.due) : "Not Paid"}</span>
								</div>
								<div class="col-xl-7 col-xxl-7 col-lg-12 text-dark mb-xl-0 mb-2">
									<p>${order.order.address ? order.order.address.join(" ===> ") : "Not began tracking, edit location" }</p> 
								</div>
							</div>
							<div class="media-footer d-sm-flex d-block align-items-center">
								<div class="me-5 text-xl-center text-start  ms-xl-3 mb-sm-0 mb-3 ms-0">
									<span class="bgl-primary text-primary rounded p-1 ps-2 pe-2 font-w600 fs-12 d-inline-block mb-2 mb-sm-3">{order.book.complete ? "
									ed" : "Transit"}</span>
									<a href="javascript:void(0);" class="btn btn-outline rounded edit me-2 rounded" data-toggle="modal" data-target="#addAddress" onclick="addAddress('${order.order._id}')">Edit location</a>
								</div>
								<div class="edit ms-auto">
									<a href="javascript:void(0);" class="btn btn-outline-success rounded  me-2" onclick="modules.delivereOrder('${order.book._id}')">Mark Delivered</a>
			<a href="javascript:void(0);" class="btn btn-outline-danger rounded" onclick="modules.deleteOrder('${order.book._id}')">Delete</a>
								</div>
							</div>
						</div>
					</div>
					
					
				</div>
				`
			}catch(e){console.log(e)}
        })
		if(found === 0){
			document.getElementById("inventoryList").innerHTML += `<h3>Not Found ${currentorder}</h3>`
		}
    })
})
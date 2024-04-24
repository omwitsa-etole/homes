$(document).ready(function(){
    let vehicle = "6b"
    if(location.search.includes("?vehicle")){
        vehicle = location.search.split("&")[0]
        vehicle = vehicle.replace("?vehicle=","")
    }else{
        location.href="all_property.html"
    }
    $("#vehicle_id").text(vehicle)
    let vehicle_id = vehicle
    fetchFunction("/api/models/admin/getDetail/"+vehicle_id,{},"post",function(datas){
        $("#update_info").click(function(){
            location.href = `add_property.html?id=${vehicle_id}&edit=true`
        })
		$(".delete-vehicle").click(function(){
			if(confirm("This action can not be undone, do you wish to proceed?")){
				fetchFunction("/api/models/admin/deleteVehicle/"+vehicle_id,{},"delete",function(dt){
					console.log(dt)
					location.href = `all_property.html?msg=Vehicle%%Deleted`
				})
			}
		})
        setTimeout(function(){
            $('.owl-carousel').owlCarousel({
                loop:true,
                margin:10,
                nav:true,
                items:datas.vehicle.description.vehicleFiles ? datas.vehicle.description.vehicleFiles.split(",") : []
              });
          
            const list = document.getElementById("vehicleBookings")
            console.log(books)
            for(var booking of datas.books.data){
                list.innerHTML += `
                <div class="media mb-3 mb-sm-4">
                    <img src="assets/images/customers/avatar.jpg" alt="/" class="rounded me-3" width="52">
                    <div class="media-body relative">
                        <h4 class="fs-16 font-w600 mb-0"><a href="orderlist.html?book_id=${booking.book._id}&detail=true" class="text-black">User : ${booking.user.name }</a></h4>
                        <span class="fs-14 d-block mb-2">${booking.book.date}</span>
                        <div class="star-icons">
                            <i class="las la-star fs-16"></i>
                            <i class="las la-star fs-16"></i>
                            <i class="las la-star fs-16"></i>
                            <i class="las la-star fs-16"></i>
                            <i class="las la-star fs-16"></i>
                        </div>
                        <span clas="absolute book-stet">${booking.invoice.complete ? "Paid" : "Pending"}</span>
                    </div>
                </div>
                `
            }
            
        },499)
        const vehicle = datas.vehicle
        const books = datas.books
        let img_file = vehicle.description.vehicleFiles ? vehicle.description.vehicleFiles : "n/a.jpg"
        document.getElementById("vehicleDetail").innerHTML = `
        <div class="row">
            <div class="col-xl-3 col-xxl-4">
                <div class="row">
                    <div class="col-xl-12">
                        <div class="card bg-primary text-center">
                            <div class="card-body">
                                <h2 class="fs-30 text-white">SALE</h2>
                                <span class="text-white font-w300">KES ${vehicle.description.vehiclePrice}</span>                            </div>
                        </div>
                    </div>
                    
                     <div class="col-xl-12">
                        <div class="card text-center">
                            <div class="card-body">
                                <h2 class="fs-30 text-black">LIVE VIEW</h2>
                                <span class="text-red font-w300">Status: ${vehicle.live_view ? "Enabled" : "Disabled"}</span> 
								<br><br><a href="live?vehicle=${vehicle._id}" class="btn btn-primary rounded mb-4">${vehicle.live_view ? "Disable" : "Enable"}</a>
							</div>
                        </div>
                    </div>
                    
                </div>
            </div>
            <div class="col-xl-9 col-xxl-8">
                <div class="row">
                    <div class="col-xl-12">
                        <div class="card">
                            <div class="card-body">
                                <div id="lightgallery" class="front-view-slider mb-sm-5 mb-3">	
                                    <div class="front-view">
                                        <img src="/assets/arrivals/${img_file.split(",")[0]}" alt="/">
                                        <div class="info">
                                            <h3 class="mb-2 text-white">>${vehicle.description.vehicleModel}</h3>
                                            <p class="mb-0"></p>
                                        </div>
                                        
                                    </div>
                                </div>
                                <div>
                                    <a href="javascript:void(0);" class="btn btn-primary rounded mb-4">${vehicle.description.vehicleStatus}</a>
                                    <div class="d-md-flex d-block mb-sm-5 mb-3">
                                        <div class="me-auto mb-md-0 mb-4">
                                            <h3>${vehicle.name}</h3>
                                            <span class="fs-16">
                                                ${vehicle.description.vehicleModel}   
                                            </span>
                                        </div>
                                        <div class="ms-md-4 text-md-right">
                                            <p class="text-black mb-1 me-1">Price range</p>
                                            <h3 class="text-primary">KES ${vehicle.description.vehiclePrice} - KES ${vehicle.description.vehicleMarketvalue}</h3>
                                        </div>
                                    </div>
                                    <div class="mb-sm-5 mb-2">
                                        <a href="javascript:void(0);" class="btn btn-primary light rounded me-2 mb-sm-0 mb-2">
                                            ${vehicle.description.vehicleFuel}
                                        </a>
                                        <a href="javascript:void(0);" class="btn btn-primary light rounded mb-sm-0 mb-2">
                                        ${vehicle.description.vehiclePassengers ? vehicle.description.vehiclePassengers : "4"} Passengers
                                        </a>
                                        <a href="javascript:void(0);" class="btn btn-primary light rounded me-2 mb-sm-0 mb-2">
                                        ${vehicle.description.vehicleWheels} Wheels
                                        </a>
                                    
                                    </div>
                                    <h4>Description</h4>
                                    
                                    <p>${vehicle.description.vehicleDescription ? vehicle.description.vehicleDescription : "Vehicle"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-12">
                        <div class="card">
                            <div class="card-body">
                            <div class="image-gallery owl-carousel flexdisplay flexrow">
                
                                    ${img_file.split(",").map(img_ => `
                                        <div class="owl-item flex_item" style="margin-right: 30px;">
                                            <img src="/assets/arrivals/${img_}" alt="/">
                                        </div>
                                    `).join('')}
                                    
                                   
                            </div>
                            <div class="owl-nav">
                                <div class="owl-prev"><i class="fas fa-caret-left"></i></div>
                                <div class="owl-next"><i class="fas fa-caret-right"></i></div>
                            </div>
                          
                        </div>
                        </div>
                    </div>
                    <div class="col-xl-12">
                        <div class="card property-features">
                            <div class="card-header border-0 pb-0">	
                                <h3 class="fs-20 text-black mb-0">Vehicle Features</h3>
                            </div>
                            <div class="card-body">
                                <ul>
                                    ${vehicle.description.vehicleFeatures ? vehicle.description.vehicleFeatures : ""}
                                    
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-12">
                        <div class="card property-features">
                            <div class="card-header border-0 pb-0">	
                                <h3 class="fs-20 text-black mb-0">Vehicle Bookings</h3>
                            </div>
                            <div class="card-body" id="vehicleBookings">
                               
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `
    })
})
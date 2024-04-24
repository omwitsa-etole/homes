$(document).ready(function(){
	
	function deleteVehicle(id){
		if(confirm("This action can not be undone, do you wish to proceed?")){
			fetchFunction("/api/models/admin/deleteVehicle/"+id,{},"delete",function(dt){
				console.log(dt)
				$("#car-"+id).remove()
			})
		}
	}
    
    fetchFunction("/api/models/admin/getVehicles",{},"post",function(datas){
        
        let html = ''
        if(datas.vehicles.length === 0){}
        for(var vehicle of datas.vehicles){
            console.log(vehicle)
            var bookings = vehicle.bookings
            vehicle = vehicle.vehicle
            let img_file = vehicle.description.vehicleFiles ? vehicle.description.vehicleFiles : "n/a.jpg"
            html += `
            <div class="col-xl-3 col-xxl-4 col-md-6 col-sm-6 col-lg-4 m-b30" style="max-height: ;" >
            <div class="property-card style-1">
            <div class="dz-media post-swiper swiper swiper-container-initialized swiper-container-horizontal swiper-container-pointer-events">
                <ul>
                    
                    <li class="rent badge badge-sm badge-primary">For ${vehicle.description.vehicleStatus ? vehicle.description.vehicleStatus :  "Rent"}</li>
                </ul>
                
            
            <span class="swiper-notification" aria-live="assertive" aria-atomic="true"></span></div>
            <div class="dz-content" onclick="location.href='detail.html?vehicle=${vehicle._id}'">
                <img src="assets/arrivals/${img_file.split(",")[0]}" height="198px" width="100%" style="object-fit:cover;"></img>
                <h3 class="title">${vehicle.description.vehiclePrice}</h3>
                <a style="position:absolute;right: 2%;text-align:right;" href="javascript:void(0)">Max ${vehicle.description.vehicleMax} | Orders ${bookings.total}<br> | Completed ${bookings.complete}</a>
                
                <div class="dz-meta">
                    <ul>
                        <li><a href="javascript:void(0);">
                        ${vehicle.description.vehicleMake }, ${vehicle.description.vehicleDetail}, ${vehicle.description.vehicleFuel}</a></li>
                    </ul>
                </div>
                <p>Live View : <a href="live_view?vehicle=${vehicle._id}" target="_blank">${vehicle.live_view ? "Enabled" : "Disabled"}</a></p>
                <hr>
                <div class="dz-footer">
                    <div class="property-card">
                        <div class="property-media">
                            <img src="assets/arrivals/01.jpg" alt="/">
                        </div>
                        <h6 class="title mb-0">${vehicle.name}</h6>
                    </div>
                    <ul>
					
					    <li><a role="button" onclick="deleteVehicle('${vehicle._id}')">
						 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
					     </a></li>
                        <li><a href="add_property.html?id=${vehicle._id}&edit=true">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z"/></svg></a></li>
                      
                    </ul>
                </div>
            </div>
        </div>
        </div>
        `
        }
        
        document.getElementById('vehicleList').innerHTML = html
    })  
})
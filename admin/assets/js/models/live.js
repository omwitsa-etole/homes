$(document).ready(function(){
    let vehicle = "null"
    if(location.search.includes("?vehicle")){
        vehicle = location.search.split("&")[0]
        vehicle = vehicle.replace("?vehicle=","")
    }else{
        location.href="all_property.html?vehilce"+vehicle
    }
    $("#live_vehicle").text(vehicle)
    fetchFunction("/api/models/admin/getDetail/"+vehicle,{},"post",function(datas){
        $("#live_vehicle").text(datas.vehicle.name)
		$(".enablelive").text(datas.vehicle.live_view ? "Disable" : "Enable")
		$(".enablelive").click(function(e){
			e.preventDefault();
			var payload = {update:true}
			payload.live_view = datas.vehicle.live_view ? false : true
			fetchFunction("/api/models/admin/updateVehicle/"+vehicle,payload,"post",function(data){
				createAlert(data)
			})
		})
    })
})
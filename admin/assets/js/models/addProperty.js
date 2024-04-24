$("#addVehicle-btn").click(function(e){
    addVehicle()
})

function addVehicle(e){
    $(e).prop('disabled', true);
    var vehicle = $("#vehicleForm").serialize({ hash: true })
    var vehicle_details =  $("#vehicledetailsForm").serialize({ hash: true })
    vehicle = new URLSearchParams(vehicle)
    const vehicleData = {}
    vehicle_details = new URLSearchParams(vehicle_details)
    for (const [key, value] of vehicle) {
        if(value === ''){continue}
        vehicleData[key] = value;
    }
    for (const [key, value] of vehicle_details) {
        if(value === ''){continue}
        vehicleData[key] = value;
    }
    var payload = vehicleData
    if(location.search.includes("id=") && location.search.includes("&edit=true")){
        var loc_id = location.search.replace("&edit=true","")
        loc_id = loc_id.replace("?id=","")
        var id = loc_id
        payload._id = id
        payload.update = true
    }
    //email,password
    
    $(e).prop('disabled', false);
    fetchFunction("/api/models/admin/newVehicle",payload,"post",function(data){
        console.log(data)
        createAlert(data)
    })
    return false
}

$(document).ready(function(){
    const features = ['entertainment','navigation','security']
    var ek = ""
    features.map(function(ft){
        console.log(ft)
       ek += `
       <div class="form-check form-check-inline">
            <input type="checkbox" name="vehicleFeatures" class="form-check-input" value="${ft}" id="flexRadioDefault${ft}">
            <label class="form-check-label" for="flexRadioDefault${ft}">${ft}</label>
        </div>
       `
    })
    $("#vehicleFeatures").html(ek)
    if(location.search.includes("id=") && location.search.includes("edit=true")){
        var loc_id = location.search.replace("&edit=true","")
        loc_id = loc_id.replace("?id=","")
        var id = loc_id
        if(id.length > 5){
            fetchFunction("/api/models/admin/getDetail/"+id,{},"post",function(datas){
                if(datas.message){
                    createAlert(datas)
                }
                var obj = datas.vehicle.description
                $(`#cardTitle`).text(`Editing Vehicle : ${datas.vehicle.name}`);
                Object.keys(obj).forEach(key => {
                    const value = obj[key];
                    $(`input[name="${key}"]`).val(value);
                    $(`textarea[name="${key}"]`).val(value);
                    $(`select[name="${key}"]`).val(value);
                    //console.log(`Key: ${key}, Value: ${value}`);
                });
                document.title = 'Editing Vehicle '+datas.vehicle.name;
            })
        }
    }
})
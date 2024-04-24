$(document).ready(function(){
    function bookHistory(data){
        let el = ''
        if(data.bookings.length === 0){
            return `<div>No Booking orders</div>`
        }
        for(var dat of data.bookings){
            let img_file = dat.vehicle.description ? dat.vehicle.description.vehicleFiles : "n/a.jpg"
            el += `
            <div class="media mb-4">
                <img class="me-sm-4 me-3 img-fluid rounded" width="90" src="assets/arrivals/${img_file}" alt="Vehicle">
                <div class="media-body">
                    <h5 class="mb-0">${data.vehicle.name}</h5>
                    <div class="star-icons">
                        <i class="fa fa-star fs-18"></i>
                        <i class="fa fa-star fs-18"></i>
                        
                    </div>
                </div>
            </div>
            `
        }
        return el
    }
    //const customers = ['John Doe']
    fetchFunction("/api/models/admin/getCustomers",{},"post",function(datas){
        console.log(datas)
        const customers = datas.users
        customers.map(function(customer){
            
            document.getElementById("customerList").innerHTML += `
                <div class="row border-bottom mx-0 pt-4 px-2 align-items-center ">
                    <div class="col-xl-3 col-xxl-4 col-lg-6 col-sm-12 mb-sm-4 mb-3 align-items-center  media">
                        <img class="me-sm-4 me-3 img-fluid rounded" width="90" src="assets/images/customers/avatar.jpg" alt="Customer">
                        <div class="media-body">
                            <span class="text-primary d-block">#C01234</span>
                            <h4 class="mb-1">${customer.user.name}</h4>
                            <span class="d-block mb-lg-0 mb-0">Join on ${customer.user.date}</span>
                        </div>
                    </div>
                    <div class="col-xl-2 col-xxl-2 col-lg-3 col-sm-4 mb-sm-4 col-6 mb-3">
                        <small class="mb-2 d-block">Location</small>
                        <span class="text-black font-w600">${customer.user.address}</span>
                    </div>
                    <div class="col-xl-2 col-xxl-3 col-lg-3 col-sm-4 mb-sm-4 col-6 mb-3 text-lg-center">
                        <small class="mb-2 d-block">Phone Number</small>
                        <span class="text-black font-w600">z${customer.user.phone}</span>
                    </div>
                    <div class="col-xl-2 col-xxl-3 col-lg-6 col-sm-4 mb-sm-4 mb-3">
                        <small class="mb-2 d-block">Email Address</small>
                        <span class="text-black font-w600">${customer.user.email}</span>
                    </div>
                    <div class="col-xl-3 col-xxl-4 col-lg-6 col-sm-6 mb-sm-4 mb-4 d-flex ">
                        <div class="dropdown media-dropdown mt-auto mb-auto me-auto">
                            <div class="btn-link" data-bs-toggle="dropdown">
                                <a href="javascript:void(0);" class="btn btn-outline-primary rounded">Show Order History
                                    <svg class="ms-2" width="12" height="6" viewBox="0 0 12 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0 -5.24537e-07L6 6L12 0" fill="#3B4CB8"></path>
                                    </svg>
                                </a>
                            </div>
                            <div class="dropdown-menu dropdown-menu-end rounded">
                                ${bookHistory(customer)}
                               
                            </div>
                        </div>
                        <div class="dropdown ms-4  mt-auto mb-auto">
                            <div class="btn-link" data-bs-toggle="dropdown">
                                <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><rect x="0" y="0" width="24" height="24"></rect><circle fill="#000000" cx="5" cy="12" r="2"></circle><circle fill="#000000" cx="12" cy="12" r="2"></circle><circle fill="#000000" cx="19" cy="12" r="2"></circle></g></svg>
                            </div>
                            <div class="dropdown-menu dropdown-menu-end">
                                <a class="dropdown-item" href="javascript:void(0);">Edit</a>
                                <a class="dropdown-item text-danger" href="javascript:void(0);">Delete</a>
                            </div>
                        </div>
                    </div>
                </div>
            `
        })
    })
    
})
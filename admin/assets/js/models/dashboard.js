function isDateFromPreviousMonth(date) {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const givenMonth = date.getMonth();
    const givenYear = date.getFullYear();

    // Calculate the previous month
    const previousMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    const previousYear = (currentMonth === 0) ? currentYear - 1 : currentYear;

    // Check if the given date is from the previous month
    return (givenMonth === previousMonth && givenYear === previousYear);
}

$(document).ready(function(){
    fetchFunction("/api/models/admin/getAnalysis",{},"post",function(datas){
        console.log(datas)
        const orders = datas.orders
        const vehicles = datas.vehicles
        const invoice = datas.invoice
        var prev_invoice = 0
        for(var inv of invoice.data){
            var date = new Date(inv.date)
            if(isDateFromPreviousMonth(date)){
                prev_invoice += inv.amount
            }
        }
        document.getElementById("dashboard-cont").innerHTML = `
        <div class="row">
            <div class="col-xl-6 col-xxl-6">
                <div class="row">
                    <div class="col-xl-12">
                        <div class="card bg-danger property-bx text-white">
                            <div class="card-body">
                                <div class="media d-sm-flex d-block align-items-center">
                                    <span class="me-4 d-block mb-sm-0 mb-3">
                                        <!-----car svg-->>
                                    </span>
                                    <div class="media-body mb-sm-0 mb-3 me-5">
                                        <h4 class="fs-22 text-white">Total Vehicles</h4>
                                        <div class="progress mt-3 mb-2" style="height:8px;">
                                            <div class="progress-bar bg-white progress-animated" style="width: 86%; height:8px;" role="progressbar">
                                                <span class="sr-only">86% Complete</span>
                                            </div>
                                        </div>
                                        
                                    </div>
                                    <span class="fs-35 font-w500">${vehicles.total}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-12 col-md-6">
                        <div class="card property-card">
                            <div class="card-body">
                                <div class="media align-items-center">
                                    <div class="media-body me-3">	
                                        <h2 class="fs-28 text-black font-w600">${vehicles.sale}</h2>
                                        <p class="property-p mb-0 text-black font-w500">Vehicles for Sale</p>
                                        
                                    </div>
                                    <div class="d-inline-block position-relative donut-chart-sale">
                                        <span class="donut1" data-peity="{ &quot;fill&quot;: [&quot;rgb(60, 76, 184)&quot;, &quot;rgba(236, 236, 236, 1)&quot;],   &quot;innerRadius&quot;: 38, &quot;radius&quot;: 10}" style="display: none;">5/8</span><svg class="peity" height="90" width="90"><path d="M 45 0 A 45 45 0 1 1 13.180194846605364 76.81980515339464 L 18.129942314911197 71.87005768508881 A 38 38 0 1 0 45 7" data-value="5" fill="rgb(60, 76, 184)"></path><path d="M 13.180194846605364 76.81980515339464 A 45 45 0 0 1 44.99999999999999 0 L 44.99999999999999 7 A 38 38 0 0 0 18.129942314911197 71.87005768508881" data-value="3" fill="rgba(236, 236, 236, 1)"></path></svg>
                                        <small class="text-primary">${(vehicles.sale/vehicles.total)*100}%</small>
                                        <span class="circle bgl-primary"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-12 col-md-6">
                        <div class="card property-card">
                            <div class="card-body">
                                <div class="media align-items-center">
                                    <div class="media-body me-3">	
                                        <h2 class="fs-28 text-black font-w600">${vehicles.rent}</h2>
                                        <p class="property-p mb-0 text-black font-w500">Vehicles for Rent</p>
                                        
                                    </div>
                                    <div class="d-inline-block position-relative donut-chart-sale">
                                        <span class="donut1" data-peity="{ &quot;fill&quot;: [&quot;rgb(55, 209, 90)&quot;, &quot;rgba(236, 236, 236, 1)&quot;],   &quot;innerRadius&quot;: 38, &quot;radius&quot;: 10}" style="display: none;">7/8</span><svg class="peity" height="90" width="90"><path d="M 45 0 A 45 45 0 1 1 13.180194846605353 13.180194846605364 L 18.129942314911187 18.129942314911197 A 38 38 0 1 0 45 7" data-value="7" fill="rgb(55, 209, 90)"></path><path d="M 13.180194846605353 13.180194846605364 A 45 45 0 0 1 44.99999999999999 0 L 44.99999999999999 7 A 38 38 0 0 0 18.129942314911187 18.129942314911197" data-value="1" fill="rgba(236, 236, 236, 1)"></path></svg>
                                        <small class="text-success">${(vehicles.rent/vehicles.total)*100}%</small>
                                        <span class="circle bgl-success"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-xl-6 col-xxl-6">
                <div class="card">
                    <div class="card-header border-0 pb-0">
                        <h3 class="fs-18 text-black">Total Revenue</h3>
                        <div class="dropdown ms-auto">
                            <div class="btn-link" data-bs-toggle="dropdown">
                                <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><rect x="0" y="0" width="24" height="24"></rect><circle fill="#000000" cx="5" cy="12" r="2"></circle><circle fill="#000000" cx="12" cy="12" r="2"></circle><circle fill="#000000" cx="19" cy="12" r="2"></circle></g></svg>
                            </div>
                            <div class="dropdown-menu dropdown-menu-end">
                                <a class="dropdown-item" href="javascript:void(0);">Edit</a>
                                <a class="dropdown-item text-danger" href="javascript:void(0);">Delete</a>
                            </div>
                        </div>
                    </div>
                    <div class="card-body pt-2 pb-0" style="position: relative;">
                        <div class="d-flex flex-wrap align-items-center">
                            <span class="fs-28 text-black font-w600 me-3">KES ${invoice.total}</span>
                            <p class="me-sm-auto me-3 mb-sm-0 mb-3">last month Total : ${prev_invoice}</p>
                            <div class="d-flex align-items-center">
                                <span class="fs-22 text-success me-2">${invoice.total > 0 ? 100*(invoice.total-prev_invoice)/invoice.total : "0"}%</span>
                            </div>
							
                        </div>
						<br>
						<div class="d-flex flex-wrap align-items-center">
                            <span class="fs-18 text-black font-w200 me-2">KES ${invoice.total - invoice.pending}</span>
							<p class="me-sm-auto me-3 mb-sm-0 mb-3">Completed Invoice payment</p>
							<div class="d-flex align-items-center">
                                <span class="fs-22 text-success me-2">${invoice.total > 0 ? 100*(invoice.total-invoice.pending)/invoice.total : 0}%</span>
                            </div>
						</div>
                        <h3 class="fs-18 text-black">Total Orders</h3>
						<div class="d-flex flex-wrap align-items-center">
                            <span class="fs-28 text-black font-w400 me-2">${vehicles.booked}</span>
							<p class="me-sm-auto me-3 mb-sm-0 mb-3">Total Orders</p>
							<div class="d-flex align-items-center">
                                <span class="fs-22 text-success me-2">${vehicles.booked > 0 ? 100*(vehicles.booked)/vehicles.booked : 0}%</span>
                            </div>
						</div>
						<div class="d-flex flex-wrap align-items-center">
                            <span class="fs-26 text-black font-w400 me-2">${vehicles.complete}</span>
							<p class="me-sm-auto me-3 mb-sm-0 mb-3">Complete Orders</p>
							<div class="d-flex align-items-center">
                                <span class="fs-22 text-success me-2">${100 - parseInt(vehicles.booked > 0 ? 100*(vehicles.booked - vehicles.complete )/vehicles.booked : 0)}%</span>
                            </div>
						</div>
						<div class="resize-triggers"><div class="expand-trigger"><div style="width: 312px; height: 91px;"></div></div><div class="contract-trigger"></div></div>
				    </div>
                </div>
            </div>
            <div class="col-xl-9 col-xxl-9">
                <div class="row">
                    <div class="col-xl-8 col-xxl-8">
                        <div class="card">
                            <div class="card-header border-0 pb-0">
                                <h3 class="fs-18 text-black">Overview</h3>
                                <div class="dropdown ms-auto">
                                    <div class="btn-link" data-bs-toggle="dropdown">
                                        <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><rect x="0" y="0" width="24" height="24"></rect><circle fill="#000000" cx="5" cy="12" r="2"></circle><circle fill="#000000" cx="12" cy="12" r="2"></circle><circle fill="#000000" cx="19" cy="12" r="2"></circle></g></svg>
                                    </div>
                                    <div class="dropdown-menu dropdown-menu-end">
                                        <a class="dropdown-item" href="javascript:void(0);">Edit</a>
                                        <a class="dropdown-item text-danger" href="javascript:void(0);">Delete</a>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body" style="position: relative;">
                                <div class="d-sm-flex flex-wrap  justify-content-around">
                                    <div class="d-flex mb-4 align-items-center">
                                        <span class="rounded me-3 bg-primary p-3">
                                            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M10.3458 25.7292H1.35412C0.758283 25.7292 0.270782 25.2417 0.270782 24.6458V9.69583C0.270782 9.42499 0.379116 9.09999 0.595783 8.93749L9.58745 0.541659C9.91245 0.270825 10.3458 0.162492 10.725 0.324992C11.1583 0.541659 11.375 0.920825 11.375 1.35416V24.7C11.375 25.2417 10.8875 25.7292 10.3458 25.7292ZM2.38328 23.6167H9.26245V3.79166L2.38328 10.1833V23.6167Z" fill="white"></path>
                                                <path d="M24.6458 25.7292H10.2916C9.69578 25.7292 9.20828 25.2417 9.20828 24.6458V11.9167C9.20828 11.3208 9.69578 10.8333 10.2916 10.8333H24.6458C25.2416 10.8333 25.7291 11.3208 25.7291 11.9167V24.7C25.7291 25.2417 25.2416 25.7292 24.6458 25.7292ZM11.375 23.6167H23.6166V12.9458H11.375V23.6167Z" fill="white"></path>
                                                <path d="M19.5541 25.7292H15.3833C14.7874 25.7292 14.2999 25.2417 14.2999 24.6458V18.0375C14.2999 17.4417 14.7874 16.9542 15.3833 16.9542H19.5541C20.1499 16.9542 20.6374 17.4417 20.6374 18.0375V24.6458C20.6374 25.2417 20.1499 25.7292 19.5541 25.7292ZM16.4666 23.6167H18.5249V19.1208H16.4666V23.6167Z" fill="white"></path>
                                            </svg>
                                        </span>
                                        <div>
                                            <p class="fs-14 mb-1">Total Sale</p>
                                            <span class="fs-18 text-black font-w700">${vehicles.sale} Unit</span>
                                        </div>
                                    </div>
                                    <div class="d-flex mb-4 align-items-center">
                                        <span class="rounded me-3 bg-success p-3">
                                            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M10.3458 25.7292H1.35412C0.758283 25.7292 0.270782 25.2417 0.270782 24.6458V9.69583C0.270782 9.42499 0.379116 9.09999 0.595783 8.93749L9.58745 0.541659C9.91245 0.270825 10.3458 0.162492 10.725 0.324992C11.1583 0.541659 11.375 0.920825 11.375 1.35416V24.7C11.375 25.2417 10.8875 25.7292 10.3458 25.7292ZM2.38328 23.6167H9.26245V3.79166L2.38328 10.1833V23.6167Z" fill="white"></path>
                                                <path d="M24.6458 25.7292H10.2916C9.69578 25.7292 9.20828 25.2417 9.20828 24.6458V11.9167C9.20828 11.3208 9.69578 10.8333 10.2916 10.8333H24.6458C25.2416 10.8333 25.7291 11.3208 25.7291 11.9167V24.7C25.7291 25.2417 25.2416 25.7292 24.6458 25.7292ZM11.375 23.6167H23.6166V12.9458H11.375V23.6167Z" fill="white"></path>
                                                <path d="M19.5541 25.7292H15.3833C14.7874 25.7292 14.2999 25.2417 14.2999 24.6458V18.0375C14.2999 17.4417 14.7874 16.9542 15.3833 16.9542H19.5541C20.1499 16.9542 20.6374 17.4417 20.6374 18.0375V24.6458C20.6374 25.2417 20.1499 25.7292 19.5541 25.7292ZM16.4666 23.6167H18.5249V19.1208H16.4666V23.6167Z" fill="white"></path>
                                            </svg>
                                        </span>
                                        <div>
                                            <p class="fs-14 mb-1">Total Rent</p>
                                            <span class="fs-18 text-black font-w700">${vehicles.rent}Unit</span>
                                        </div>
                                    </div>
                                </div>
                                
                            <div class="resize-triggers"><div class="expand-trigger"><div style="width: 312px; height: 179px;"></div></div><div class="contract-trigger"></div></div></div>
                        </div>
                    </div>
                    <div class="col-xl-4 col-xxl-4">
                        <div class="row">
                            <div class="col-xl-12 col-xxl-12 col-md-6">
                                <div class="card">
                                    <div class="card-body" style="position: relative;">
                                        
                                    <div class="resize-triggers"><div class="expand-trigger"><div style="width: 312px; height: 307px;"></div></div><div class="contract-trigger"></div></div></div>
                                </div>
                            </div>
                            <div class="col-xl-12 col-xxl-12 col-md-6">
                                <div class="card">
                                    <div class="card-body">
                                        <p class="mb-2 d-flex  fs-16 text-black font-w500">Product Viewed
                                            <span class="pull-right ms-auto text-dark fs-14"> </span>
                                        </p>
                                        <div class="progress mb-4" style="height:10px">
                                            <div class="progress-bar bg-primary progress-animated" style="width:75%; height:10px;" role="progressbar">
                                                <span class="sr-only">75% Complete</span>
                                            </div>
                                        </div>
                                        <p class="mb-2 d-flex  fs-16 text-black font-w500">Product Listed
                                            <span class="pull-right ms-auto text-dark fs-14">${vehicles.total} Unit</span>
                                        </p>
                                        <div class="progress mb-3" style="height:10px">
                                            <div class="progress-bar bg-primary progress-animated" style="width:99%; height:10px;" role="progressbar">
                                                <span class="sr-only">99% Complete</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-12">
                
                    </div>
                </div>
            </div>
            <div class="col-xl-3 col-xxl-3">
                <div class="row">
                    
                    <div class="col-xl-12 col-lg-6">
                        <div class="card">
                            <div class="card-header border-0 pb-0">
                                <h3 class="fs-18 text-black">Recent Vehicle</h3>
                                <div class="dropdown ms-auto">
                                    <div class="btn-link" data-bs-toggle="dropdown">
                                        <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><rect x="0" y="0" width="24" height="24"></rect><circle fill="#000000" cx="5" cy="12" r="2"></circle><circle fill="#000000" cx="12" cy="12" r="2"></circle><circle fill="#000000" cx="19" cy="12" r="2"></circle></g></svg>
                                    </div>
                                    <div class="dropdown-menu dropdown-menu-end">
                                        <a class="dropdown-item" href="javascript:void(0);">Edit</a>
                                        <a class="dropdown-item text-danger" href="javascript:void(0);">Delete</a>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body">
                                <div class="testimonial-one owl-carousel owl-loaded owl-drag">
                                    
                                    <ul>
                                        <li>Vin : ${vehicles.data.length > 0 ? vehicles.data[0].description.vehicleVin : "N/A"}</li>
                                        <li>Model: ${vehicles.data.length > 0 ? vehicles.data[0].description.vehicleModel : "N/A"}</li>
                                        <li>Price: ${vehicles.data.length > 0 ? vehicles.data[0].description.vehiclePrice : "N/A"}</li>
                                        <li>Status: ${vehicles.data.length > 0 ? vehicles.data[0].description.vehicleStatus : "N/A"}</li>
                                    </ul>
                                    <ul>
                                        <li>Vin : ${vehicles.data.length > 0 ? vehicles.data[0].description.vehicleVin : "N/A"}</li>
                                        <li>Model: ${vehicles.data.length > 0 ? vehicles.data[0].description.vehicleModel : "N/A"}</li>
                                        <li>Price: ${vehicles.data.length > 0 ? vehicles.data[0].description.vehiclePrice : "N/A"}</li>
                                        <li>Status: ${vehicles.data.length > 0 ? vehicles.data[0].description.vehicleStatus : "N/A"}</li>
                                    </ul>
                                <div class="owl-nav"><div class="owl-prev"><i class="las la-long-arrow-alt-left"></i></div><div class="owl-next"><i class="las la-long-arrow-alt-right"></i></div></div><div class="owl-dots disabled"></div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `
    })
})
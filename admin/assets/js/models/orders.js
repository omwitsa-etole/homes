$(document).ready(function(){
    fetchFunction("/api/models/admin/getOrders",{},"post",function(datas){
        console.log(datas)
        $("#total_customers").text(datas.customers)
        $("#total_transactions").text(datas.transactions)
        const orders = datas.orders
        tr_class = "even"
        console.log(orders)
        $("#totalOrders").html(datas.transactions)
        orders.map(function(order){
            
            let vehicle = order.vehicle
            var orderss = order.books
            orderss.map(function(order){
                let stet = order.invoice.complete ? "Paid" : "Pending"  
                let confirmed = order.book.confirmed ? "Accepted" : "Processing"
                document.getElementById("orderList").innerHTML += `
                <tr class=${tr_class}>
                    <td class="sorting_1">
                        <div class="form-check custom-checkbox ms-2">
                            <input type="checkbox" class="form-check-input" id="customCheckBox5" required="">
                            <label class="form-check-label" for="customCheckBox5"></label>
                        </div>
                    </td>
                    <td>#${order.book._id}</td>
                    <td>${new Date(order.invoice.date)}</td>
                    <td>${order.user.name}</td>
                    <td class="text-ov">${vehicle.name} <br></td>
                    <td class="text-ov">${vehicle.description.vehicleModel}</td>
                    <td>$${order.invoice.amount}</td>
                    <td>${vehicle.description.vehicleStatus ? vehicle.description.vehicleStatus :"Sale" }</td>
                    
                    <td><span class="text-warning">${stet} | ${confirmed}</span></td>
                    <td class="text-end">
                        <div class="dropdown ms-auto">
                            <div class="btn-link" data-bs-toggle="dropdown">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.0005 12C11.0005 12.5523 11.4482 13 12.0005 13C12.5528 13 13.0005 12.5523 13.0005 12C13.0005 11.4477 12.5528 11 12.0005 11C11.4482 11 11.0005 11.4477 11.0005 12Z" stroke="#3E4954" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                    <path d="M18.0005 12C18.0005 12.5523 18.4482 13 19.0005 13C19.5528 13 20.0005 12.5523 20.0005 12C20.0005 11.4477 19.5528 11 19.0005 11C18.4482 11 18.0005 11.4477 18.0005 12Z" stroke="#3E4954" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                    <path d="M4.00049 12C4.00049 12.5523 4.4482 13 5.00049 13C5.55277 13 6.00049 12.5523 6.00049 12C6.00049 11.4477 5.55277 11 5.00049 11C4.4482 11 4.00049 11.4477 4.00049 12Z" stroke="#3E4954" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                </svg>
                            </div>
                            <div class="dropdown-menu dropdown-menu-end">
                                <a class="dropdown-item text-black" href="javascript:void(0);" onclick="modules.saveAddress('${order.book._id}',undefined)">Accept order</a>
                                <a class="dropdown-item text-black" href="javascript:void(0);" onclick="modules.deleteOrder('${order.book._id}')">Reject order</a>
                                <a class="dropdown-item text-black" href="javascript:void(0);" href="inventory?order=${order.invoice._id}">View Details</a>
                            </div>
                        </div>
                    </td>
                </tr>
                `
                if(tr_class === "even"){tr_class="odd"}else{tr_class="even"}
            })
            
        })
    })
})
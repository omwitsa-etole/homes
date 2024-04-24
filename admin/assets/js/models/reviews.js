$(document).ready(function(){
    fetchFunction("/api/models/admin/getReviews",{},"post",function(datas){
        console.log(datas)
        const reviews = datas.reviews
        reviews.map(function(reviews){
            document.getElementById("reviewList").html += `
            <div id="navpills-" class="tab-pane active show" role="tabpanel">
                <div class="card review-table">
                    <div class="media align-items-center">
                        <img class="me-3 img-fluid rounded" width="90" src="/assets/images/customers/avatar.jpg" alt="User">
                        <div class="media-body d-lg-flex d-block row align-items-center">
                            <div class="col-xl-4 col-xxl-5 col-lg-12 review-bx">
                                <span class="text-primary d-block">#${review.review._id}</span>
                                <h3 class="fs-18 text-black font-w600 mb-1">${review.user.name}</h3>
                                <span class="d-block mb-xl-0 mb-3">Join on ${new Date(review.user.date).toUTCString()}</span>
                            </div>
                            <div class="col-xl-7 col-xxl-7 col-lg-12 text-dark mb-xl-0 mb-2">
                                <p>${review.review.description}</p>
                            </div>
                        </div>
                        <div class="media-footer d-sm-flex d-block align-items-center">
                            <div class="me-5 text-xl-center text-start  ms-xl-3 mb-sm-0 mb-3 ms-0">
                                <span class="bgl-primary text-primary rounded p-1 ps-2 pe-2 font-w600 fs-12 d-inline-block mb-2 mb-sm-3">Rating : ${review.review.rating}</span>
                                <span class="star-review d-block">
                                    <i class="fas fa-star text-primary"></i>
                                    <i class="fas fa-star text-primary"></i>
                                    <i class="fas fa-star text-primary"></i>
                                    <i class="fas fa-star text-primary"></i>
                                    <i class="fas fa-star text-gray"></i>
                                </span>
                            </div>
                            <div class="edit ms-auto">
                                <a href="javascript:void(0);" class="btn btn-outline-success rounded  me-2" onclick="modules.addReview('${review.review._id}',{approve:true})">Approve</a>
                                <a href="javascript:void(0);" class="btn btn-outline-danger rounded" onclick="modules.addReview('${review.review._id}',{approve:false})">Reject</a>
                            </div>
                        </div>
                    </div>
                </div>
                
                
            </div>
            `
        })
    })
})
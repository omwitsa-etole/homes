$("#loginForm").submit(function(e){
    e.preventDefault()
    var userData = {}
    var login = $("#loginForm").serialize({ hash: true })
    login = new URLSearchParams(login)
    for (const [key, value] of login) {
        userData[key] = value;
    }
    var payload = userData
    fetchFunction("/api/auth",payload,"post",function(data){
        console.log(data)
        createAlert(data)
        if(data.token){
            const session = new Session()
            session.set("token="+data.token)
            session.set("user="+data.token)
            location.href = 'index.html'
        }
    })
    return false
})

$("#registerForm").submit(function(e){
    e.preventDefault()
    var userData = {}
    var login = $("#registerForm").serialize({ hash: true })
    login = new URLSearchParams(login)
    for (const [key, value] of login) {
        userData[key] = value;
    }
    var payload = userData
    fetchFunction("/api/models/admin2/createCompany",payload,"post",function(data){
        console.log(data)
        createAlert(data)
        if(data.next){
           
            location.href = data.next
        }
    })
    return false
})


// TODO 2.6 - Handle the notificationclose event

// TODO 2.7 - Handle the notificationclick event

// TODO 3.1 - add push event listener
// self.addEventListener('notificationclick',event=>{
//     console.log(event.notification)
//     const notification = event.notification
//     const primaryKey = notification.data.primaryKey
//     const action = event.action
//     if(action=='close'){
//         notification.close()
//     }
//     else{
//         clients.openWindow('samples/page'+primaryKey+'.html')
//         notification.close()
//     }
// })
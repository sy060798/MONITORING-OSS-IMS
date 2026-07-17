// ========================================
// REALTIME SYSTEM
// OSS IMS MONITORING
// ========================================


// Interval default
let realtimeInterval = null;


// Default refresh
let realtimeDelay = 60000;





// ========================================
// START REALTIME
// ========================================


function startRealtime(callback, delay=realtimeDelay){


    stopRealtime();



    realtimeInterval = setInterval(async()=>{



        try{


            if(callback){


                await callback();



            }



        }


        catch(error){



            console.error(

                "REALTIME ERROR",

                error

            );



        }



    },delay);



}









// ========================================
// STOP REALTIME
// ========================================


function stopRealtime(){



    if(realtimeInterval){



        clearInterval(

            realtimeInterval

        );



        realtimeInterval=null;



    }



}









// ========================================
// REFRESH PAGE DATA
// ========================================


async function refreshCurrentPage(){



    let page =

    window.location.pathname;







    try{



        if(

            page.includes("index")

        ){



            if(typeof loadDashboard === "function"){


                await loadDashboard();


            }



        }








        else if(

            page.includes("oss")

        ){



            if(typeof loadOSS === "function"){



                await loadOSS();



            }



        }








        else if(

            page.includes("ims")

        ){



            if(typeof loadIMS === "function"){



                await loadIMS();



            }



        }








        else if(

            page.includes("master")

        ){



            if(typeof loadMaster === "function"){



                await loadMaster();



            }



        }



    }



    catch(error){



        console.error(

            "REFRESH PAGE ERROR",

            error

        );



    }



}









// ========================================
// GLOBAL REALTIME START
// ========================================


function enableRealtime(){



    startRealtime(



        refreshCurrentPage,

        realtimeDelay



    );



}









// ========================================
// GLOBAL REALTIME STOP
// ========================================


function disableRealtime(){



    stopRealtime();



}









// ========================================
// CHANGE INTERVAL
// ========================================


function setRealtimeSpeed(seconds){



    realtimeDelay =

    seconds * 1000;



    enableRealtime();



}









// ========================================
// AUTO START
// ========================================


document.addEventListener(


"DOMContentLoaded",


()=>{



    enableRealtime();



});


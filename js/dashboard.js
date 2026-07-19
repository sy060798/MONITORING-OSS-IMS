// ========================================
// DASHBOARD JS V3
// OSS IMS MONITORING
// API.JS V3 COMPATIBLE
// ========================================


let dashboardData = {};

let statusChart = null;

let dashboardTimer = null;


// ========================================
// LOAD DASHBOARD
// ========================================

async function loadDashboard(){


    try{


        dashboardLoading(true);



        const result = await getDashboardAPI();



        dashboardData = result || {};



        renderDashboard();



        updateChart();



        updateAPIStatus(true);



        updateLastUpdate();



    }



    catch(error){



        console.error(

            "DASHBOARD ERROR",

            error

        );



        updateAPIStatus(false);



    }



    finally{


        dashboardLoading(false);


    }



}





// ========================================
// RENDER CARD
// ========================================

function renderDashboard(){



    setValue(

        "totalOSS",

        dashboardData.totalOSS || 0

    );



    setValue(

        "totalIMS",

        dashboardData.totalIMS || 0

    );



    setValue(

        "totalMaster",

        dashboardData.totalMaster || 0

    );



    setValue(

        "totalBelum",

        dashboardData.belumIMS || 0

    );





    setValue(

        "done",

        dashboardData.selesai || 0

    );



    setValue(

        "progress",

        dashboardData.progress || 0

    );



    setValue(

        "revisi",

        dashboardData.revisi || 0

    );



    setValue(

        "belum",

        dashboardData.belumIMS || 0

    );



}






// ========================================
// CHART
// ========================================

function updateChart(){



    const canvas =

    document.getElementById(

        "statusChart"

    );




    if(!canvas){

        return;

    }





    if(typeof Chart==="undefined"){

        return;

    }





    if(statusChart){


        statusChart.destroy();


    }






    statusChart = new Chart(

        canvas,

        {


            type:"doughnut",



            data:{



                labels:[

                    "Sudah",

                    "Progress",

                    "Revisi",

                    "Belum IMS"

                ],



                datasets:[{




                    data:[


                        dashboardData.selesai || 0,


                        dashboardData.progress || 0,


                        dashboardData.revisi || 0,


                        dashboardData.belumIMS || 0


                    ],




                    backgroundColor:[


                        "#16a34a",

                        "#2563eb",

                        "#eab308",

                        "#dc2626"


                    ],




                    borderWidth:0



                }]



            },





            options:{



                responsive:true,


                maintainAspectRatio:false,


                cutout:"70%",



                plugins:{


                    legend:{


                        position:"bottom"


                    }


                }



            }




        }



    );



}






// ========================================
// UPDATE TEXT
// ========================================

function setValue(id,value){



    const el =

    document.getElementById(id);



    if(el){



        el.innerText = value;



    }



}

// ========================================
// DASHBOARD JS V3
// PART 2/2
// ========================================


// ========================================
// LAST UPDATE
// ========================================

function updateLastUpdate(){


    setValue(

        "lastUpdate",

        new Date()

        .toLocaleString(

            "id-ID"

        )

    );


}







// ========================================
// API STATUS
// ========================================

function updateAPIStatus(status){



    const el =

    document.getElementById(

        "apiStatus"

    );




    if(!el){

        return;

    }





    if(status){



        el.innerHTML =

        "🟢 Online";



    }

    else{



        el.innerHTML =

        "🔴 Offline";



    }



}







// ========================================
// LOADING
// ========================================

function dashboardLoading(state){



    const el =

    document.getElementById(

        "dashboardStatus"

    );




    if(!el){

        return;

    }





    if(state){


        el.innerText =

        "Loading...";


    }

    else{


        el.innerText =

        "Realtime";


    }


}







// ========================================
// MANUAL REFRESH
// ========================================

async function refreshDashboard(){



    await loadDashboard();



}







// ========================================
// REALTIME
// ========================================

function startDashboardRealtime(delay=60000){



    stopDashboardRealtime();




    dashboardTimer =

    setInterval(()=>{



        loadDashboard();



    },delay);



}







// ========================================
// STOP REALTIME
// ========================================

function stopDashboardRealtime(){



    if(dashboardTimer){



        clearInterval(

            dashboardTimer

        );



        dashboardTimer=null;



    }


}







// ========================================
// SAFE LOAD
// ========================================

async function safeLoadDashboard(){



    try{



        await loadDashboard();



    }



    catch(error){



        console.error(

            "SAFE DASHBOARD ERROR",

            error

        );



        updateAPIStatus(false);



    }



}







// ========================================
// INIT
// ========================================

document.addEventListener(


"DOMContentLoaded",


()=>{



    safeLoadDashboard();



    startDashboardRealtime(

        60000

    );



}





);







// ========================================
// CLEANUP
// ========================================

window.addEventListener(


"beforeunload",


()=>{



    stopDashboardRealtime();




    if(statusChart){



        statusChart.destroy();



        statusChart=null;



    }



}



);







console.log(

"DASHBOARD JS V3 COMPLETE"

);

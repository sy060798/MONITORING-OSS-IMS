// ========================================
// DASHBOARD MONITORING V3
// UI ONLY
// FOLLOW API.JS
// ========================================

let dashboardState = {
    data: null
};

let statusChart = null;

let dashboardTimer = null;

// ========================================
// LOAD DASHBOARD
// ========================================

async function loadDashboard() {

    try {

        setDashboardLoading(true);

        const result = await getDashboard();

        dashboardState.data = result || {};

        updateDashboardCard();

        updateStatusChart();

        updateLastUpdate();

        updateAPIStatus(true);

    }

    catch (error) {

        console.error(
            "LOAD DASHBOARD ERROR",
            error
        );

        updateAPIStatus(false);

    }

    finally {

        setDashboardLoading(false);

    }

}

// ========================================
// UPDATE DASHBOARD CARD
// ========================================

function updateDashboardCard() {

    const data = dashboardState.data || {};

    setText(
        "totalOSS",
        (data.totalOSS || 0) + " Data"
    );

    setText(
        "totalIMS",
        (data.totalIMS || 0) + " Data"
    );

    setText(
        "totalMaster",
        (data.totalMaster || 0) + " Data"
    );

    setText(
        "totalBelum",
        (data.belumIMS || 0) + " Data"
    );

    setText(
        "done",
        data.sudah || 0
    );

    setText(
        "progress",
        data.progress || 0
    );

    setText(
        "revisi",
        data.revisi || 0
    );

    setText(
        "belum",
        data.belumIMS || 0
    );

}

// ========================================
// GET STATUS DATA
// ========================================

function getStatusData() {

    const data = dashboardState.data || {};

    return {

        sudah: data.sudah || 0,

        progress: data.progress || 0,

        revisi: data.revisi || 0,

        belum: data.belumIMS || 0

    };

}

// ========================================
// CREATE / UPDATE STATUS CHART
// ========================================

function updateStatusChart() {

    let canvas =
    document.getElementById(
        "statusChart"
    );


    if(!canvas){

        return;

    }



    let status = getStatusData();



    if(statusChart){

        statusChart.destroy();

    }




    if(typeof Chart === "undefined"){

        console.error(
            "Chart library belum aktif"
        );

        return;

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


                        status.sudah,

                        status.progress,

                        status.revisi,

                        status.belum


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
// UPDATE LAST UPDATE
// ========================================

function updateLastUpdate(){


    setText(

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


    let el =

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
// SET TEXT HELPER
// ========================================

function setText(id,value){


    let element =

    document.getElementById(id);



    if(element){


        element.innerText = value;


    }


}





// ========================================
// LOADING CONTROL
// ========================================

function setDashboardLoading(state){


    let status =

    document.getElementById(

        "dashboardStatus"

    );




    if(!status){

        return;

    }





    if(state){


        status.innerText =

        "Loading...";


    }


    else{


        status.innerText =

        "Realtime";


    }



}

// ========================================
// REFRESH DASHBOARD MANUAL
// ========================================

function refreshDashboard(){

    loadDashboard();

}





// ========================================
// REALTIME DASHBOARD
// ========================================

function startDashboardRealtime(delay = 60000){


    stopDashboardRealtime();



    dashboardTimer =

    setInterval(()=>{


        loadDashboard();



    }, delay);



}





// ========================================
// STOP REALTIME
// ========================================

function stopDashboardRealtime(){


    if(dashboardTimer){


        clearInterval(

            dashboardTimer

        );


        dashboardTimer = null;


    }


}





// ========================================
// SAFE LOAD DASHBOARD
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
// AUTO REFRESH CONTROL
// ========================================

function enableDashboardRealtime(){


    startDashboardRealtime(

        60000

    );


}





function disableDashboardRealtime(){


    stopDashboardRealtime();


}





// ========================================
// INIT DASHBOARD
// ========================================

document.addEventListener(

    "DOMContentLoaded",

    ()=>{


        loadDashboard();


        startDashboardRealtime();



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


            statusChart = null;


        }


    }


);






// ========================================
// FINAL READY
// ========================================

console.log(

    "DASHBOARD V3 READY - API.JS MODE"

);

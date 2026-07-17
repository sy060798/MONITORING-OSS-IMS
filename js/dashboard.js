// ========================================
// DASHBOARD MONITORING
// OSS IMS SYSTEM
// ========================================


let dashboardState = {

    oss: [],

    ims: [],

    master: []

};





let statusChart = null;







// ========================================
// LOAD DASHBOARD
// ========================================


async function loadDashboard(){


    try{


        setDashboardLoading(true);




        const [

            oss,

            ims

        ] = await Promise.all([


            getOSS(),


            getIMS()


        ]);






        dashboardState.oss = oss || [];


        dashboardState.ims = ims || [];






        dashboardState.master =

        buildMasterDashboard(


            dashboardState.oss,


            dashboardState.ims


        );








        updateDashboardCard();





        updateStatusChart();





        updateLastUpdate();





        updateAPIStatus(true);





    }



    catch(error){



        console.error(

            "Dashboard Error",

            error

        );




        updateAPIStatus(false);



    }




    finally{


        setDashboardLoading(false);


    }




}









// ========================================
// BUILD MASTER DATA
// ========================================


function buildMasterDashboard(oss,ims){



    let result=[];






    oss.forEach(itemOSS=>{



        let itemIMS = ims.find(item=>



            item.reference_code ===

            itemOSS.reference_code



        );








        let data={



            wo:"-",


            reference_code:

            itemOSS.reference_code || "",



            customer:

            itemOSS.customer || "",



            city:

            itemOSS.city || "",



            bulan:"-",



            job_name:"-",



            status:"",



            note:""



        };









        if(!itemIMS){



            data.status =

            "Belum IMS";



            data.note =

            "Reference Code tidak ada di IMS";



        }



        else{



            data.wo =

            itemIMS.wo || "-";




            data.bulan =

            itemIMS.bulan || "-";





            data.job_name =

            itemIMS.job_name || "-";







            if(



                itemIMS.status === "Approved"

                ||

                itemIMS.status === "Booked"

                ||

                itemIMS.status === "Closed"

                ||

                itemIMS.status === "Ready to Invoice"



            ){



                data.status =

                "Sudah";



            }



            else if(



                itemIMS.status === "Revisi"



            ){



                data.status =

                "Revisi";



            }



            else{



                data.status =

                "Progress";



            }





        }







        result.push(data);



    });






    return result;



}
// ========================================
// UPDATE DASHBOARD CARD
// ========================================


function updateDashboardCard(){


    let totalOSS =

    dashboardState.oss.length;




    let totalIMS =

    dashboardState.ims.length;




    let totalMaster =

    dashboardState.master.length;





    let status =

    countStatus();







    setText(

        "totalOSS",

        totalOSS + " Data"

    );





    setText(

        "totalIMS",

        totalIMS + " Data"

    );





    setText(

        "totalMaster",

        totalMaster + " Data"

    );





    setText(

        "totalBelum",

        status.belum + " Data"

    );







    setText(

        "done",

        status.sudah

    );





    setText(

        "progress",

        status.progress

    );





    setText(

        "revisi",

        status.revisi

    );





    setText(

        "belum",

        status.belum

    );



}









// ========================================
// HITUNG STATUS MASTER
// ========================================


function countStatus(){



    let result = {



        sudah:0,

        progress:0,

        revisi:0,

        belum:0



    };








    dashboardState.master.forEach(item=>{



        if(item.status==="Sudah"){



            result.sudah++;



        }



        else if(item.status==="Progress"){



            result.progress++;



        }



        else if(item.status==="Revisi"){



            result.revisi++;



        }



        else if(item.status==="Belum IMS"){



            result.belum++;



        }



    });







    return result;



}









// ========================================
// CREATE / UPDATE CHART
// ========================================


function updateStatusChart(){



    let canvas =

    document.getElementById(

        "statusChart"

    );





    if(!canvas){

        return;

    }







    let status =

    countStatus();







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



    });



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



        element.innerText=value;



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
// REALTIME REFRESH
// ========================================


function refreshDashboard(){



    loadDashboard();



}









// ========================================
// START DASHBOARD
// ========================================


document.addEventListener(

"DOMContentLoaded",

()=>{



    loadDashboard();



});

// ========================================
// MASTER MONITORING V8
// PART 1
// LOAD ENGINE + DONE FILTER
// OSS VS IMS VS DONE
// ========================================


window.MASTER_STATE = {

    data:[],
    filter:[],
    page:1,
    limit:100,
    timer:null

};




// ========================================
// LOAD MASTER DATA
// ========================================

async function loadMaster(){


    try{


        showLoadingMaster(true);



        let oss =
        await getOSS();



        let ims =
        await getIMS();



        let done =
        await getDONEAPI();




        if(!Array.isArray(oss))
            oss=[];


        if(!Array.isArray(ims))
            ims=[];


        if(!Array.isArray(done))
            done=[];





        // ===============================
        // INDEX DONE
        // DATA YANG SUDAH PINDAH
        // TIDAK BOLEH TAMPIL
        // ===============================


        let doneMap={};



        done.forEach(item=>{


            let ref =

            String(
                item.reference_code || ""
            )
            .trim();



            if(ref){

                doneMap[ref]=true;

            }


        });






        // ===============================
        // INDEX IMS
        // ===============================


        let imsMap={};



        ims.forEach(item=>{


            let ref =

            String(
                item.reference_code || ""
            )
            .trim();



            if(ref){

                imsMap[ref]=item;

            }


        });








        let result=[];






        // ===============================
        // BUILD MASTER
        // ===============================


        oss.forEach(item=>{


            let ref =

            String(
                item.reference_code || ""
            )
            .trim();




            // SKIP JIKA SUDAH DONE

            if(doneMap[ref]){

                return;

            }






            let imsData =

            imsMap[ref];







            let row={


                wo:"-",


                reference_code:ref,


                customer:
                item.customer || "",



                city:
                item.city || "",



                bulan:"-",


                job_name:"-",


                status:"",


                note:""



            };







            if(!imsData){


                row.status =
                "Belum";


                row.note =
                "Belum masuk IMS";



            }


            else{


                row.wo =
                imsData.wo || "-";



                row.bulan =
                imsData.bulan || "-";



                row.job_name =
                imsData.job_name || "-";




                let st =

                String(
                    imsData.status || ""
                );






                if(

                    st==="Submitted" ||

                    st==="Approved" ||

                    st==="Booked" ||

                    st==="Closed" ||

                    st==="Ready to Invoice"

                ){


                    // SAFETY
                    // kalau belum sync DONE

                    row.status =
                    "Sudah";


                    row.note =
                    "Menunggu pindah DONE";


                }



                else if(

                    st==="Revisi"

                ){


                    row.status =
                    "Revisi";


                    row.note =
                    "Perlu revisi IMS";


                }



                else{


                    row.status =
                    "Progress";


                }



            }







            result.push(row);




        });









        MASTER_STATE.data =

        result;



        MASTER_STATE.filter =

        [...result];



        MASTER_STATE.page=1;





        renderMasterTable();


        updateMasterCard();


        generateMasterFilter();



    }



    catch(error){


        console.error(

            "MASTER V8 ERROR",

            error

        );


        showMasterError();


    }



    finally{


        showLoadingMaster(false);


    }


}





console.log(
"MASTER V8 PART 1 READY"
);

// ========================================
// MASTER MONITORING V8
// PART 2
// SEARCH + FILTER + BADGE
// ========================================



// ========================================
// SEARCH MASTER
// ========================================

function searchMaster(){


    filterMaster();


}






// ========================================
// FILTER MASTER
// ========================================

function filterMaster(){



    let search =

    document

    .getElementById(
        "searchMaster"
    )

    ?.value

    .toLowerCase() || "";





    let city =

    document

    .getElementById(
        "cityMaster"
    )

    ?.value || "";






    let status =

    document

    .getElementById(
        "statusMaster"
    )

    ?.value || "";






    let bulan =

    document

    .getElementById(
        "monthMaster"
    )

    ?.value || "";






    let job =

    document

    .getElementById(
        "jobMaster"
    )

    ?.value

    .toLowerCase() || "";









    MASTER_STATE.filter =


    MASTER_STATE.data.filter(item=>{






        let cocokSearch =


        !search


        ||


        String(
            item.reference_code
        )

        .toLowerCase()

        .includes(search);








        let cocokCity =


        !city


        ||


        item.city===city;








        let cocokStatus =


        !status


        ||


        item.status===status;









        let cocokBulan =


        !bulan


        ||


        item.bulan===bulan;








        let cocokJob =


        !job


        ||


        String(
            item.job_name
        )

        .toLowerCase()

        .includes(job);








        return (


            cocokSearch


            &&


            cocokCity


            &&


            cocokStatus


            &&


            cocokBulan


            &&


            cocokJob



        );





    });







    MASTER_STATE.page=1;



    renderMasterTable();



}









// ========================================
// GENERATE FILTER
// ========================================

function generateMasterFilter(){



    generateCityFilter();


    generateMonthFilter();



}









// ========================================
// FILTER CITY
// ========================================

function generateCityFilter(){



    let el =

    document.getElementById(

        "cityMaster"

    );



    if(!el)

    return;







    let list =


    [

        ...new Set(

            MASTER_STATE.data.map(

                x=>x.city

            )

        )

    ];








    let html =


    `

    <option value="">

    Semua Kota

    </option>

    `;








    list.forEach(city=>{



        if(city){



            html +=


            `

            <option value="${city}">

            ${city}

            </option>

            `;



        }



    });







    el.innerHTML=html;



}









// ========================================
// FILTER BULAN
// ========================================

function generateMonthFilter(){



    let el =

    document.getElementById(

        "monthMaster"

    );



    if(!el)

    return;








    let list =


    [

        ...new Set(

            MASTER_STATE.data.map(

                x=>x.bulan

            )

        )

    ];









    let html =


    `

    <option value="">

    Semua Bulan

    </option>

    `;








    list.forEach(month=>{



        if(

            month

            &&

            month!="-"

        ){



            html +=


            `

            <option value="${month}">

            ${month}

            </option>

            `;



        }



    });








    el.innerHTML=html;



}









// ========================================
// STATUS BADGE
// ========================================

function masterStatusBadge(status){



    let color="";





    switch(status){



        case "Sudah":


            color="status-sudah";


        break;





        case "Progress":


            color="status-progress";


        break;





        case "Revisi":


            color="status-revisi";


        break;





        case "Belum":


            color="status-belum";


        break;





        default:


            color="";



    }







    return


    `

    <span class="badge ${color}">

    ${status}

    </span>

    `;



}









// ========================================
// CARD SUMMARY
// ========================================

function updateMasterCard(){



    let data =

    MASTER_STATE.data;





    let sudah=0;


    let progress=0;


    let revisi=0;


    let belum=0;








    data.forEach(item=>{



        if(item.status==="Sudah")

            sudah++;



        else if(item.status==="Progress")

            progress++;



        else if(item.status==="Revisi")

            revisi++;



        else if(item.status==="Belum")

            belum++;



    });








    let a =

    document.getElementById(

        "masterSudah"

    );



    let b =

    document.getElementById(

        "masterProgress"

    );



    let c =

    document.getElementById(

        "masterRevisi"

    );



    let d =

    document.getElementById(

        "masterBelum"

    );








    if(a)

        a.innerText=sudah;



    if(b)

        b.innerText=progress;



    if(c)

        c.innerText=revisi;



    if(d)

        d.innerText=belum;




}





console.log(
"MASTER V8 PART 2 READY"
);

// ========================================
// MASTER MONITORING V8
// PART 3
// EXPORT EXCEL + TOOLBAR + PAGINATION
// ========================================



// ========================================
// EXPORT MASTER EXCEL
// ========================================

function exportMasterExcel(){



    if(typeof XLSX==="undefined"){


        alert(
            "Library Excel belum aktif"
        );


        return;


    }






    let rows =


    MASTER_STATE.filter.map(item=>({



        WO:

        item.wo || "",





        Reference_Code:

        item.reference_code || "",





        Customer:

        item.customer || "",





        City:

        item.city || "",





        Bulan:

        item.bulan || "",





        Job_Name:

        item.job_name || "",





        Status:

        item.status || "",





        Note:

        item.note || ""



    }));









    if(rows.length===0){



        alert(

            "Tidak ada data"

        );


        return;


    }









    let ws =


    XLSX.utils.json_to_sheet(

        rows

    );









    ws["!cols"]=[


        {
            wch:15
        },


        {
            wch:20
        },


        {
            wch:25
        },


        {
            wch:15
        },


        {
            wch:15
        },


        {
            wch:25
        },


        {
            wch:15
        },


        {
            wch:30
        }


    ];









    let wb =


    XLSX.utils.book_new();








    XLSX.utils.book_append_sheet(


        wb,


        ws,


        "MASTER"



    );









    XLSX.writeFile(


        wb,


        "MASTER_MONITORING_V8.xlsx"



    );




}









// ========================================
// REFRESH MASTER
// ========================================

async function refreshMaster(){



    MASTER_STATE.page=1;



    await loadMaster();



}









// ========================================
// PAGINATION
// ========================================


function nextMasterPage(){



    let max =


    Math.ceil(


        MASTER_STATE.filter.length /


        MASTER_STATE.limit


    );








    if(

        MASTER_STATE.page < max

    ){



        MASTER_STATE.page++;



        renderMasterTable();



    }




}









function prevMasterPage(){



    if(

        MASTER_STATE.page > 1

    ){



        MASTER_STATE.page--;



        renderMasterTable();



    }




}









// ========================================
// PAGE INFO
// ========================================

function updateMasterPageInfo(){



    let el =


    document.getElementById(


        "masterPageInfo"


    );






    if(!el)

        return;









    let total =


    Math.ceil(


        MASTER_STATE.filter.length /


        MASTER_STATE.limit


    );








    el.innerText =



    "Halaman "

    +

    MASTER_STATE.page

    +

    " / "

    +

    (

        total || 1

    );




}









// ========================================
// TOOLBAR INIT
// ========================================

function initMasterToolbar(){



    let btnExport =


    document.querySelector(


        ".btn-export-master"


    );






    if(btnExport){



        btnExport.onclick =


        exportMasterExcel;



    }




}









// ========================================
// LAST UPDATE INFO
// ========================================

function updateMasterInfo(){



    let el =


    document.getElementById(


        "loadingMaster"


    );







    if(el){



        el.innerHTML =


        "🟢 Update "

        +

        new Date()

        .toLocaleTimeString(

            "id-ID"

        );



    }



}







console.log(
"MASTER V8 PART 3 READY"
);

 // ========================================
// MASTER MONITORING V8
// PART 4
// REALTIME + INIT + GLOBAL ACCESS
// ========================================



// ========================================
// REALTIME START
// ========================================

function startMasterRealtime(){



    stopMasterRealtime();




    MASTER_STATE.timer =



    setInterval(()=>{



        loadMaster();



    },60000);




}









// ========================================
// STOP REALTIME
// ========================================

function stopMasterRealtime(){



    if(

        MASTER_STATE.timer

    ){



        clearInterval(

            MASTER_STATE.timer

        );



        MASTER_STATE.timer=null;



    }



}









// ========================================
// ERROR DISPLAY
// ========================================

function showMasterError(){



    let table =


    document.getElementById(


        "masterData"


    );








    if(table){



        table.innerHTML =



        `

        <tr>

        <td colspan="8">

        Gagal mengambil data Master

        </td>

        </tr>

        `;



    }



}









// ========================================
// LOADING MASTER
// ========================================

function showLoadingMaster(status){



    let el =


    document.getElementById(


        "loadingMaster"


    );







    if(!el)

    return;









    if(status){



        el.innerHTML =


        "⏳ Loading Master...";



    }


    else{



        updateMasterInfo();



    }



}









// ========================================
// INIT MASTER SYSTEM
// ========================================

async function initMasterSystem(){



    try{



        console.log(


            "START MASTER V8"


        );








        await loadMaster();








        startMasterRealtime();








        initMasterToolbar();








        console.log(



            "MASTER V8 READY"



        );




    }



    catch(error){



        console.error(



            "MASTER INIT ERROR",



            error



        );



        showMasterError();



    }




}









// ========================================
// FORCE SYNC VIEW
// ========================================

async function syncMasterView(){



    try{



        await getDONEAPI();



        await loadMaster();




    }



    catch(e){



        console.error(

            "SYNC MASTER ERROR",

            e

        );



    }



}









// ========================================
// GLOBAL ACCESS HTML
// ========================================


window.loadMaster =

loadMaster;




window.refreshMaster =

refreshMaster;




window.searchMaster =

searchMaster;




window.filterMaster =

filterMaster;




window.exportMasterExcel =

exportMasterExcel;




window.nextMasterPage =

nextMasterPage;




window.prevMasterPage =

prevMasterPage;




window.startMasterRealtime =

startMasterRealtime;




window.stopMasterRealtime =

stopMasterRealtime;




window.syncMasterView =

syncMasterView;









// ========================================
// DOM READY
// ========================================

document.addEventListener(


"DOMContentLoaded",


()=>{


    initMasterSystem();



});









// ========================================
// CLEANUP
// ========================================

window.addEventListener(


"beforeunload",


()=>{


    stopMasterRealtime();



});









console.log(
"MASTER V8 PART 4 READY"
);

 // ========================================
// MASTER MONITORING V8
// PART 5
// FINAL RENDER + DATA PROTECTION
// ========================================



// ========================================
// GET PAGE DATA
// ========================================

function getMasterPageData(){



    let start =


    (MASTER_STATE.page - 1)


    *


    MASTER_STATE.limit;







    return MASTER_STATE.filter.slice(


        start,


        start + MASTER_STATE.limit


    );



}









// ========================================
// RENDER MASTER TABLE
// ========================================

function renderMasterTable(){



    let tbody =


    document.getElementById(


        "masterData"


    );






    if(!tbody)

        return;








    let data =


    getMasterPageData();









    if(

        data.length===0

    ){



        tbody.innerHTML =



        `

        <tr>

        <td colspan="8">

        Data kosong

        </td>

        </tr>

        `;



        updateMasterPageInfo();



        return;



    }








    let html="";









    data.forEach(item=>{





        html +=



        `

        <tr>


        <td>${item.wo || "-"}</td>


        <td>${item.reference_code || "-"}</td>


        <td>${item.customer || "-"}</td>


        <td>${item.city || "-"}</td>


        <td>${item.bulan || "-"}</td>


        <td>${item.job_name || "-"}</td>


        <td>

        ${masterStatusBadge(item.status)}

        </td>


        <td>${item.note || "-"}</td>


        </tr>

        `;



    });








    tbody.innerHTML = html;





    updateMasterPageInfo();



}









// ========================================
// VALIDASI DATA MASTER
// ========================================
// Jika reference sudah DONE
// Jangan tampil di web
// ========================================

function removeDoneFromMaster(){



    if(

        !Array.isArray(

            MASTER_STATE.data

        )

    )

    return;








    MASTER_STATE.data =


    MASTER_STATE.data.filter(item=>{


        return item.status !== "DONE";



    });







    MASTER_STATE.filter =


    [...MASTER_STATE.data];



}









// ========================================
// MANUAL CHECK DATA
// ========================================

function checkMasterData(){



    console.log(

        "MASTER DATA",

        MASTER_STATE.data

    );



    return MASTER_STATE.data;



}









// ========================================
// CLEAR MASTER CACHE
// ========================================

function clearMasterCache(){



    MASTER_STATE.data=[];


    MASTER_STATE.filter=[];


    MASTER_STATE.page=1;



}









// ========================================
// FORCE UPDATE STATUS
// ========================================

async function updateMasterStatus(){



    try{



        await syncMasterView();



        showToast(

            "Master berhasil diperbarui"

        );



    }



    catch(e){



        console.error(

            "UPDATE STATUS ERROR",

            e

        );



    }



}









// ========================================
// EXPORT GLOBAL
// ========================================

window.renderMasterTable =

renderMasterTable;



window.updateMasterStatus =

updateMasterStatus;



window.checkMasterData =

checkMasterData;



window.clearMasterCache =

clearMasterCache;









console.log(
"MASTER V8 PART 5 READY"
);

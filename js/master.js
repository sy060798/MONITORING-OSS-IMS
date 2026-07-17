// ========================================
// MASTER MONITORING
// OSS VS IMS
// ========================================


let masterData = [];

let masterFilterData = [];









// ========================================
// LOAD MASTER
// ========================================


async function loadMaster(){


    try{



        showLoadingMaster(true);






        const oss = await getOSS();



        const ims = await getIMS();







        masterData = [];








        // buat index IMS agar cepat
        // tidak pakai find berulang


        let imsMap = {};





        ims.forEach(item=>{


            imsMap[item.reference_code] = item;



        });









        oss.forEach(itemOSS=>{





            let itemIMS =

            imsMap[itemOSS.reference_code];









            let data = {



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











            // =====================
            // BELUM IMS
            // =====================


            if(!itemIMS){



                data.status =

                "🔴 Belum IMS";




                data.note =

                "Reference Code belum masuk IMS";



            }









            else{



                data.wo =

                itemIMS.wo || "-";





                data.bulan =

                itemIMS.bulan || "-";





                data.job_name =

                itemIMS.job_name || "-";





                let statusIMS =

                itemIMS.status;








                if(



                    statusIMS==="Approved" ||


                    statusIMS==="Booked" ||


                    statusIMS==="Closed" ||


                    statusIMS==="Ready to Invoice"



                ){



                    data.status =

                    "🟢 Sudah";



                }







                else if(

                    statusIMS==="Revisi"

                ){



                    data.status =

                    "🟡 Revisi";





                    data.note =

                    "Perlu revisi IMS";



                }








                else{



                    data.status =

                    "🔵 Progress";



                }




            }









            masterData.push(data);






        });










        masterFilterData =

        [...masterData];








        tampilkanMaster(

            masterFilterData

        );






        updateMasterCard();






        generateMasterFilter();






        updateMasterInfo();





    }







    catch(error){





        console.error(

            "MASTER ERROR",

            error

        );



    }







    finally{



        showLoadingMaster(false);



    }



}









// ========================================
// TAMPIL MASTER TABLE
// ========================================


function tampilkanMaster(data){



    let html="";







    if(!data || data.length===0){



        html=`



        <tr>


        <td colspan="8">


        Data tidak ditemukan


        </td>


        </tr>



        `;



    }







    else{



        data.forEach(item=>{





            html += `



            <tr>



            <td>

            ${item.wo}

            </td>






            <td>

            ${item.reference_code}

            </td>






            <td>

            ${item.customer}

            </td>






            <td>

            ${item.city}

            </td>






            <td>

            ${item.bulan}

            </td>






            <td>

            ${item.job_name}

            </td>






            <td>

            ${statusMasterBadge(item.status)}

            </td>






            <td>

            ${item.note || "-"}

            </td>






            </tr>



            `;




        });



    }







    let table =

    document.getElementById(

        "masterData"

    );







    if(table){



        table.innerHTML = html;



    }




}
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



    let keyword =


    document

    .getElementById(

        "searchMaster"

    )

    .value

    .toLowerCase();







    let city =


    document

    .getElementById(

        "cityMaster"

    )

    .value;







    let status =


    document

    .getElementById(

        "statusMaster"

    )

    .value;







    let bulan =


    document

    .getElementById(

        "monthMaster"

    )

    .value;







    let job =


    document

    .getElementById(

        "jobMaster"

    )

    .value

    .toLowerCase();









    let result =


    masterData.filter(item=>{







        let cocokSearch = true;







        if(keyword){



            cocokSearch =



            String(item.reference_code)

            .toLowerCase()

            .includes(keyword);




        }









        let cocokCity =



        city === ""

        ||

        item.city === city;









        let cocokStatus =



        status === ""

        ||

        item.status

        .includes(status);









        let cocokBulan =



        bulan === ""

        ||

        item.bulan === bulan;









        let cocokJob =



        job === ""

        ||

        String(item.job_name)

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








    masterFilterData = result;






    tampilkanMaster(

        result

    );



}











// ========================================
// GENERATE ALL FILTER
// ========================================


function generateMasterFilter(){



    generateCityMaster();



    generateMonthMaster();



}











// ========================================
// FILTER CITY
// ========================================


function generateCityMaster(){



    let select =


    document

    .getElementById(

        "cityMaster"

    );






    if(!select){



        return;



    }








    let cities = [



        ...new Set(



            masterData.map(


                item=>item.city


            )



        )



    ];









    let html = `



    <option value="">


    Semua Kota


    </option>



    `;









    cities.forEach(city=>{





        if(city){



            html += `



            <option value="${city}">


            ${city}


            </option>



            `;



        }




    });







    select.innerHTML = html;



}











// ========================================
// FILTER MONTH
// ========================================


function generateMonthMaster(){



    let select =


    document

    .getElementById(

        "monthMaster"

    );







    if(!select){



        return;



    }









    let months = [



        ...new Set(



            masterData.map(


                item=>item.bulan


            )



        )



    ];









    let html = `



    <option value="">


    Semua Bulan


    </option>



    `;








    months.forEach(month=>{





        if(

            month &&

            month !== "-"

        ){



            html += `



            <option value="${month}">


            ${month}


            </option>



            `;




        }



    });









    select.innerHTML = html;



}









// ========================================
// STATUS BADGE
// ========================================


function statusMasterBadge(status){



    let cls="";








    if(status.includes("Sudah")){



        cls="status-sudah";



    }





    else if(status.includes("Revisi")){



        cls="status-revisi";



    }





    else if(status.includes("Belum")){



        cls="status-belum";



    }







    else{



        cls="status-progress";



    }








    return `



    <span class="badge ${cls}">


    ${status}


    </span>



    `;



}
// ========================================
// UPDATE CARD MASTER
// ========================================


function updateMasterCard(){



    let sudah = 0;

    let progress = 0;

    let revisi = 0;

    let belum = 0;







    masterData.forEach(item=>{





        if(

            item.status.includes("Sudah")

        ){



            sudah++;



        }






        else if(


            item.status.includes("Revisi")

        ){



            revisi++;



        }






        else if(


            item.status.includes("Belum")

        ){



            belum++;



        }






        else if(


            item.status.includes("Progress")

        ){



            progress++;



        }




    });









    let elSudah =


    document

    .getElementById(

        "masterSudah"

    );







    let elProgress =


    document

    .getElementById(

        "masterProgress"

    );







    let elRevisi =


    document

    .getElementById(

        "masterRevisi"

    );







    let elBelum =


    document

    .getElementById(

        "masterBelum"

    );









    if(elSudah)

        elSudah.innerText = sudah;







    if(elProgress)

        elProgress.innerText = progress;







    if(elRevisi)

        elRevisi.innerText = revisi;







    if(elBelum)

        elBelum.innerText = belum;






}









// ========================================
// UPDATE LAST UPDATE
// ========================================


function updateMasterInfo(){



    let el =


    document

    .getElementById(

        "lastUpdateMaster"

    );






    if(el){



        el.innerText =


        new Date()

        .toLocaleString(

            "id-ID"

        );



    }



}











// ========================================
// LOADING MASTER
// ========================================


function showLoadingMaster(status){



    let el =


    document

    .getElementById(

        "loadingMaster"

    );








    if(!el){



        return;



    }








    if(status){



        el.innerHTML =

        "⏳ Loading...";



    }






    else{



        el.innerHTML =

        "🟢 Ready";



    }





}











// ========================================
// REALTIME REFRESH
// ========================================


let masterTimer = null;








function startMasterRealtime(){



    stopMasterRealtime();








    masterTimer =


    setInterval(()=>{



        loadMaster();



    },60000);





}












// ========================================
// STOP REALTIME
// ========================================


function stopMasterRealtime(){



    if(masterTimer){



        clearInterval(

            masterTimer

        );



        masterTimer = null;



    }



}











// ========================================
// EXPORT MASTER DATA
// ========================================


function exportMasterExcel(){



    if(

        typeof XLSX === "undefined"

    ){



        alert(

        "Library Excel belum aktif"

        );



        return;



    }









    let ws =


    XLSX.utils

    .json_to_sheet(

        masterData

    );









    let wb =


    XLSX.utils

    .book_new();








    XLSX.utils

    .book_append_sheet(

        wb,

        ws,

        "MASTER"

    );









    XLSX.writeFile(

        wb,

        "Master_Monitoring.xlsx"

    );




}











// ========================================
// INIT MASTER
// ========================================


document.addEventListener(


"DOMContentLoaded",


()=>{





    loadMaster();




    startMasterRealtime();





});
// ========================================
// PAGINATION MASTER
// ========================================


let masterPage = 1;

let masterLimit = 100;









function renderMasterPagination(data){



    let start =

    (masterPage - 1)

    *

    masterLimit;







    let end =

    start +

    masterLimit;








    let pageData =

    data.slice(

        start,

        end

    );








    tampilkanMaster(

        pageData

    );






    updatePaginationInfo(

        data.length

    );



}









// ========================================
// NEXT PAGE
// ========================================


function nextMasterPage(){



    let maxPage =


    Math.ceil(

        masterFilterData.length /

        masterLimit

    );






    if(masterPage < maxPage){



        masterPage++;

        renderMasterPagination(

            masterFilterData

        );



    }



}









// ========================================
// PREVIOUS PAGE
// ========================================


function prevMasterPage(){



    if(masterPage > 1){



        masterPage--;


        renderMasterPagination(

            masterFilterData

        );



    }



}









// ========================================
// PAGE INFO
// ========================================


function updatePaginationInfo(total){



    let el =


    document

    .getElementById(

        "masterPageInfo"

    );







    if(el){



        let max =


        Math.ceil(

            total /

            masterLimit

        );







        el.innerText =


        "Halaman "

        +

        masterPage

        +

        " / "

        +

        max;



    }




}









// ========================================
// DEBOUNCE SEARCH
// ========================================


let masterSearchTimer = null;








function debounceMasterSearch(){



    clearTimeout(

        masterSearchTimer

    );







    masterSearchTimer =


    setTimeout(()=>{



        searchMaster();



    },400);



}









// ========================================
// REFRESH MANUAL
// ========================================


async function refreshMaster(){



    await loadMaster();



}









// ========================================
// SAFE LOAD MASTER
// ========================================


async function safeLoadMaster(){



    try{



        await loadMaster();



    }



    catch(error){



        console.error(

            "MASTER LOAD ERROR",

            error

        );





        let table =


        document

        .getElementById(

            "masterData"

        );







        if(table){



            table.innerHTML = `



            <tr>


            <td colspan="8">


            Gagal mengambil data


            </td>


            </tr>



            `;



        }




    }



}









// ========================================
// OVERRIDE FILTER RENDER
// ========================================


const oldFilterMaster = filterMaster;








filterMaster = function(){



    oldFilterMaster();



    masterPage = 1;



};











// ========================================
// OPTIMASI TAMPIL DATA BESAR
// ========================================


const oldTampilkanMaster = tampilkanMaster;








tampilkanMaster = function(data){



    if(data.length > masterLimit){



        masterFilterData = data;



        renderMasterPagination(

            data

        );



    }



    else{



        oldTampilkanMaster(

            data

        );



    }



};









// ========================================
// FINAL START
// ========================================


window.addEventListener(

"beforeunload",

()=>{


    stopMasterRealtime();


});

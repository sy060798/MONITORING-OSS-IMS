// ========================================
// OSS MANAGEMENT SYSTEM V4
// API.JS V3 COMPATIBLE
// CRUD + PAGINATION + EXCEL READY
// ========================================


let OSS_DATA = [];

let OSS_EDIT_ID = null;

let OSS_PAGE = 1;

let OSS_LIMIT = 100;

let OSS_TOTAL = 0;



// ========================================
// LOAD OSS
// ========================================

async function loadOSS(){


    try{


        showLoadingOSS(true);


        const result = await apiRequest(

            "getOSS",

            {

                page:OSS_PAGE,

                limit:OSS_LIMIT

            }

        );



        if(!result.success){

            throw new Error(
                result.message
            );

        }



        OSS_DATA = result.data || [];

        OSS_TOTAL = OSS_DATA.length;



        renderOSS(OSS_DATA);


        updateTotalOSS();



    }

    catch(error){


        console.error(
            "LOAD OSS ERROR",
            error
        );


        renderOSS([]);


    }


    finally{


        showLoadingOSS(false);


    }


}





// ========================================
// RENDER TABLE
// ========================================


function renderOSS(data){


    let html="";


    if(!data.length){


        html=`

        <tr>

        <td colspan="5">

        Belum ada data OSS

        </td>

        </tr>

        `;


    }


    else{


        data.forEach((item,index)=>{


            html += `

            <tr>


            <td>${item.reference_code || "-"}</td>


            <td>${item.cust_id || "-"}</td>


            <td>${item.customer || "-"}</td>


            <td>${item.city || "-"}</td>


            <td>


            <button

            class="btn edit"

            onclick="editOSS(${index})">

            ✏ Edit

            </button>


            <button

            class="btn delete"

            onclick="removeOSS(${index})">

            🗑 Hapus

            </button>


            </td>


            </tr>

            `;


        });


    }



    const table =

    document.getElementById(

        "ossData"

    );



    if(table){

        table.innerHTML=html;

    }


}






// ========================================
// SAVE OSS
// ========================================


async function saveOSS(){


    let data={


        reference_code:

        getInput("referenceCode"),



        cust_id:

        getInput("custID"),



        customer:

        getInput("customer"),



        city:

        getInput("city")


    };



    if(!data.reference_code){


        alert(
            "Reference Code wajib"
        );


        return;


    }



    let result;



    if(OSS_EDIT_ID){


        result = await apiRequest(

            "updateOSS",

            {

                id:OSS_EDIT_ID,

                ...data

            }

        );


    }

    else{


        result = await apiRequest(

            "addOSS",

            data

        );


    }



    if(result.success){


        closeOSS();


        resetOSSForm();


        loadOSS();


    }



}







// ========================================
// EDIT
// ========================================


function editOSS(index){


    let item = OSS_DATA[index];


    OSS_EDIT_ID=item.id;



    setInput(

        "referenceCode",

        item.reference_code

    );


    setInput(

        "custID",

        item.cust_id

    );


    setInput(

        "customer",

        item.customer

    );


    setInput(

        "city",

        item.city

    );



    openAddOSS();



}







// ========================================
// DELETE
// ========================================


async function removeOSS(index){


    let item = OSS_DATA[index];



    if(!confirm(
        "Hapus OSS?"
    )) return;



    let result = await apiRequest(

        "deleteOSS",

        {

            id:item.id

        }

    );



    if(result.success){


        loadOSS();


    }


}







// ========================================
// SEARCH
// ========================================


function searchOSS(){


    let key =

    getInput(

        "searchOSS"

    )

    .toLowerCase();



    let result = OSS_DATA.filter(item=>{


        return (

        String(item.reference_code)

        .toLowerCase()

        .includes(key)



        ||



        String(item.customer)

        .toLowerCase()

        .includes(key)



        ||



        String(item.city)

        .toLowerCase()

        .includes(key)

        );


    });



    renderOSS(result);


}






// ========================================
// FORM HELPER
// ========================================


function getInput(id){


    let el=document.getElementById(id);


    return el ? el.value.trim() : "";


}



function setInput(id,val){


    let el=document.getElementById(id);


    if(el){

        el.value=val || "";

    }


}







// ========================================
// RESET
// ========================================


function resetOSSForm(){


    OSS_EDIT_ID=null;


    [

    "referenceCode",

    "custID",

    "customer",

    "city"

    ].forEach(id=>{


        setInput(id,"");


    });


}







// ========================================
// MODAL
// ========================================


function openAddOSS(){


    let modal=document.getElementById(

        "modalOSS"

    );


    if(modal){

        modal.style.display="flex";

    }


}



function closeOSS(){


    let modal=document.getElementById(

        "modalOSS"

    );


    if(modal){

        modal.style.display="none";

    }


}







// ========================================
// TOTAL
// ========================================


function updateTotalOSS(){


    let el=document.getElementById(

        "totalOSS"

    );


    if(el){


        el.innerText=

        OSS_TOTAL+" Data";


    }


}






// ========================================
// LOADING
// ========================================


function showLoadingOSS(state){


    let el=document.getElementById(

        "loadingOSS"

    );


    if(!el)return;



    el.innerHTML = state ?

    "⏳ Loading..." :

    "🟢 Ready";


}







// ========================================
// START
// ========================================


document.addEventListener(

"DOMContentLoaded",

()=>{


    loadOSS();


});


console.log(

"OSS JS V4 READY API.JS V3"

);

// ========================================
// OSS JS V4 PART 2
// PAGINATION + EXCEL IMPORT EXPORT
// API.JS V3 CONNECT
// ========================================


// ========================================
// PAGINATION
// ========================================


function nextOSSPage(){


    let maxPage = Math.ceil(

        OSS_TOTAL / OSS_LIMIT

    );



    if(OSS_PAGE < maxPage){


        OSS_PAGE++;


        loadOSS();


    }


}







function prevOSSPage(){


    if(OSS_PAGE > 1){


        OSS_PAGE--;


        loadOSS();


    }


}







function renderOSSPagination(){


    let el=document.getElementById(

        "ossPagination"

    );



    if(!el)return;



    let totalPage=Math.ceil(

        OSS_TOTAL /

        OSS_LIMIT

    );



    el.innerHTML=`


    <button onclick="prevOSSPage()">

    ◀

    </button>


    <span>

    ${OSS_PAGE} / ${totalPage || 1}

    </span>


    <button onclick="nextOSSPage()">

    ▶

    </button>


    `;



}







// ========================================
// REFRESH OSS
// ========================================


async function refreshOSS(){


    OSS_PAGE=1;


    await loadOSS();


}







// ========================================
// IMPORT EXCEL OSS
// ========================================


function importOSSExcel(file){



    if(typeof XLSX==="undefined"){


        alert(
            "Excel library belum aktif"
        );


        return;


    }





    let reader=new FileReader();




    reader.onload=function(e){



        let data=new Uint8Array(

            e.target.result

        );




        let workbook=XLSX.read(

            data,

            {

                type:"array"

            }

        );




        let sheet=

        workbook.Sheets[

            workbook.SheetNames[0]

        ];




        let rows=

        XLSX.utils.sheet_to_json(

            sheet

        );




        bulkOSSAPI(rows)

        .then(result=>{


            if(result.success){


                alert(
                    "Import OSS berhasil"
                );


                loadOSS();


            }



        });



    };




    reader.readAsArrayBuffer(file);



}








// ========================================
// EXPORT EXCEL OSS
// ========================================


function exportOSSExcel(){



    if(typeof XLSX==="undefined"){


        alert(
            "Excel library belum aktif"
        );


        return;


    }





    let data=OSS_DATA.map(item=>({



        Reference_Code:

        item.reference_code || "",



        Cust_ID:

        item.cust_id || "",



        Customer:

        item.customer || "",



        City:

        item.city || ""



    }));







    let ws=

    XLSX.utils.json_to_sheet(

        data

    );



    let wb=

    XLSX.utils.book_new();




    XLSX.utils.book_append_sheet(

        wb,

        ws,

        "OSS"

    );





    XLSX.writeFile(

        wb,

        "DATA_OSS.xlsx"

    );



}








// ========================================
// UPLOAD BUTTON CONNECT
// ========================================


function uploadOSS(){



    let input=

    document.getElementById(

        "fileOSS"

    );



    if(input && input.files[0]){


        importOSSExcel(

            input.files[0]

        );


    }


}








// ========================================
// BULK ADD CONNECT API
// ========================================


async function bulkOSSAPI(rows){



    return await apiRequest(

        "bulkOSS",

        rows

    );


}







// ========================================
// AUTO REFRESH OSS
// ========================================


let OSS_TIMER=null;



function startOSSRealtime(){



    stopOSSRealtime();



    OSS_TIMER=setInterval(()=>{


        loadOSS();



    },60000);



}






function stopOSSRealtime(){



    if(OSS_TIMER){


        clearInterval(

            OSS_TIMER

        );


        OSS_TIMER=null;


    }


}






// ========================================
// INIT REALTIME
// ========================================


window.addEventListener(

"beforeunload",

()=>{


    stopOSSRealtime();


});



console.log(

"OSS JS V4 PART 2 READY"

);
// ========================================
// OSS JS V4 PART 3
// FILTER + VALIDATION + UI CONNECTOR
// API.JS V3 READY
// ========================================


// ========================================
// FILTER ADVANCED
// ========================================

function filterOSSStatus(status){


    let result = OSS_DATA.filter(item=>{


        return item.status === status;


    });



    renderOSS(result);


}








// ========================================
// SORT DATA
// ========================================


function sortOSS(field){



    let result=[...OSS_DATA];



    result.sort((a,b)=>{


        return String(

            a[field] || ""

        )

        .localeCompare(

            String(

                b[field] || ""

            )

        );


    });



    renderOSS(result);



}








// ========================================
// VALIDATE FORM
// ========================================


function validateOSS(data){



    if(!data.reference_code){


        return false;


    }



    if(!data.customer){


        return false;


    }



    return true;



}








// ========================================
// PATCH SAVE OSS
// ========================================


async function saveOSSFinal(){



    let data={



        reference_code:

        getInput("referenceCode"),



        cust_id:

        getInput("custID"),



        customer:

        getInput("customer"),



        city:

        getInput("city")



    };




    if(!validateOSS(data)){


        alert(

        "Data OSS belum lengkap"

        );


        return;


    }





    try{



        let result;



        if(OSS_EDIT_ID){



            result = await apiRequest(

                "updateOSS",

                {

                    id:OSS_EDIT_ID,

                    ...data

                }

            );



        }

        else{



            result = await apiRequest(

                "addOSS",

                data

            );



        }







        if(result.success){



            closeOSS();



            resetOSSForm();



            await loadOSS();



        }



    }


    catch(e){



        console.error(

            "SAVE OSS ERROR",

            e

        );


    }



}








// ========================================
// CHECK API OSS
// ========================================


async function checkOSSAPI(){



    let result = await apiRequest(

        "test",

        {}

    );



    if(result.success){



        console.log(

        "OSS API ONLINE"

        );


    }

    else{


        console.log(

        "OSS API ERROR"

        );


    }



    return result;



}









// ========================================
// DOWNLOAD TEMPLATE EXCEL
// ========================================


function downloadOSSTemplate(){



    if(typeof XLSX==="undefined"){


        return;


    }




    let template=[{


        reference_code:"REF001",


        cust_id:"C001",


        customer:"Customer",


        city:"Jakarta"



    }];




    let ws=

    XLSX.utils.json_to_sheet(

        template

    );



    let wb=

    XLSX.utils.book_new();




    XLSX.utils.book_append_sheet(

        wb,

        ws,

        "TEMPLATE"

    );




    XLSX.writeFile(

        wb,

        "TEMPLATE_OSS.xlsx"

    );



}








// ========================================
// MODAL CLICK OUTSIDE
// ========================================


window.onclick=function(e){



    let modal=

    document.getElementById(

        "modalOSS"

    );



    if(e.target===modal){



        closeOSS();



    }



}








// ========================================
// RESET PAGE
// ========================================


function resetOSSTable(){



    OSS_PAGE=1;



    loadOSS();



}








// ========================================
// FINAL READY
// ========================================


console.log(

"OSS JS V4 PART 3 READY"

);

// ========================================
// OSS JS V4 PART 4
// FINAL INTEGRATION SYSTEM
// API.JS V3 READY
// ========================================


// ========================================
// GLOBAL STATUS
// ========================================


let OSS_SYSTEM_READY = false;

let OSS_AUTO_REFRESH = null;








// ========================================
// INIT OSS SYSTEM
// ========================================


async function initOSSSystem(){


    try{


        console.log(

        "START OSS SYSTEM"

        );



        await checkOSSAPI();



        await loadOSS();



        startOSSRealtime();



        OSS_SYSTEM_READY=true;



        console.log(

        "OSS SYSTEM READY"

        );



    }


    catch(error){


        console.error(

        "OSS INIT ERROR",

        error

        );


    }


}









// ========================================
// AUTO SYNC OSS
// ========================================


function startOSSRealtime(){


    stopOSSRealtime();



    OSS_AUTO_REFRESH = setInterval(()=>{


        loadOSS();



    },60000);



}







function stopOSSRealtime(){



    if(OSS_AUTO_REFRESH){



        clearInterval(

            OSS_AUTO_REFRESH

        );



        OSS_AUTO_REFRESH=null;



    }



}









// ========================================
// GET ALL OSS DATA
// ========================================


async function getAllOSS(){



    let result=[];


    let page=1;



    while(true){



        let response = await apiRequest(

            "getOSS",

            {

                page:page,

                limit:100

            }

        );



        if(

            !response.success ||

            !response.data ||

            response.data.length===0

        ){



            break;


        }



        result.push(

            ...response.data

        );



        page++;



    }




    return result;



}








// ========================================
// BACKUP OSS EXCEL
// ========================================


async function backupOSSExcel(){



    let data = await getAllOSS();



    if(typeof XLSX==="undefined"){


        alert(

        "Excel library belum aktif"

        );


        return;


    }




    let ws =

    XLSX.utils.json_to_sheet(

        data

    );




    let wb =

    XLSX.utils.book_new();




    XLSX.utils.book_append_sheet(

        wb,

        ws,

        "OSS_BACKUP"

    );




    XLSX.writeFile(

        wb,

        "BACKUP_OSS_FULL.xlsx"

    );



}








// ========================================
// DELETE MULTI OSS
// ========================================


async function deleteMultipleOSS(ids){



    if(!Array.isArray(ids)){

        return;

    }





    for(let id of ids){



        await apiRequest(

            "deleteOSS",

            {

                id:id

            }

        );



    }





    await loadOSS();



}









// ========================================
// CHECK DUPLICATE
// ========================================


function checkDuplicateOSS(reference){



    return OSS_DATA.some(item=>{


        return (

            item.reference_code === reference

        );


    });



}








// ========================================
// PRINT OSS
// ========================================


function printOSS(){



    window.print();



}









// ========================================
// KEYBOARD SHORTCUT
// ========================================


document.addEventListener(

"keydown",

(e)=>{



    if(

        e.ctrlKey &&

        e.key==="r"

    ){



        e.preventDefault();



        loadOSS();



    }



}

);








// ========================================
// FINAL START
// ========================================


document.addEventListener(

"DOMContentLoaded",

()=>{


    initOSSSystem();


});








console.log(

"OSS JS V4 FINAL COMPLETE"

);

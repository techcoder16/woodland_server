


var manual = '<li><span class="dropdown language-dropdown "><i class="icon icon-th"></i> <a class="dropdown-toggle" data-toggle="dropdown">Manuals<i class="caret"></i></a><ul id="app-menu-list" class="dropdown-menu" role="menu"><li><a target="_blank" href="https://xinix.co.uk/wp-content/uploads/2020/07/Manual_Basic_User_1.1.pdf" >Basic User Manual</a></li><li><a target="_blank" href="https://xinix.co.uk/wp-content/uploads/2020/07/Office_Manager.pdf">Office User Manual</a></li></ul></span></li>'


$('.user-toolbar').prepend(manual);

const getDomains =  async ()=>{

    try{

    let  domains= [];
    let territory = [];
    let resellerDomain = {};
    let resellerData = {
        object: 'reseller',
        action: 'read',
        format: 'json',
      
    };

   const resellerResponse = await  netsapiens.api.post(resellerData);
   resellerResponse.map ((reseller)=>{
    territory.push(reseller.territory)


})






    let domainArg = {
        object: 'domain',
        action: 'read',
        format: 'json',
  
      
    };
    
   let responseDomains =  await netsapiens.api.post(domainArg);
   
   responseDomains.map((element)=>{

    domains.push(element)
    if(element.territory)
    {
   
        if (!resellerDomain[element.territory]) {
            resellerDomain[element.territory] = [];
            resellerDomain[element.territory].push(element.domain)
        }
        else
        {
            resellerDomain[element.territory].push(element.domain);
        }   
    }
       
});


let domainsSet = new Set(domains);
domains = [...domainsSet];


let args2 = {
    object: 'subscriber',
    action: 'read',
    format: 'json',
  
};

const responseUsers =  await netsapiens.api.post(args2);

let totalWork = {}
responseUsers.map((element)=>{

    Object.keys(resellerDomain).map((value)=>{

        if (resellerDomain[value].includes(element.domain) && !element.srv_code.toLowerCase().includes('system') && !element.last_name.toLowerCase().includes('queue') && element.email !== 'vm@netsapiens.com') {
            totalWork[value] = totalWork[value] ? totalWork[value] + 1 : 1;

        }
    })



})

return totalWork


}
catch(e)
{
    console.log("Could not evaluate ",e)

}
}


if (window.location.pathname.endsWith('/portal/resellers')) {
   

async function updateRowData(index, row) {
    const dataDomains =   await getDomains();

    try{
var rowData = [];
$(row).find('td').each(function() {
    rowData.push($(this).text().trim());


});



if (rowData && rowData.length > 0) {
    domainName = rowData[0];

    if (dataDomains.hasOwnProperty(domainName)) {
        var chargableUsers = dataDomains[domainName];
            
            rowData[rowData.length-1] = chargableUsers
         
        $(row).append('<td>' + chargableUsers + '</td>');


    } else {
        console.log("Domain not found in domains object:", domainName);
    }
}
}
catch(e)
{
    console.log("..............errr",e)
}




}
$('.table-container table thead tr').append('<th>Chargable users</th>');


$('.table-container table tbody tr').each(async function(index, row) {
   await updateRowData(index, row);

});

}
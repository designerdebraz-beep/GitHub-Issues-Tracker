
btnall = document.getElementById('all')
btopen = document.getElementById('open')
btclosed = document.getElementById('closed')

btnall.classList.add("bg-blue-600","text-white")
const spinner = document.getElementById("spinner")
const allbtn = document.getElementById("issueCount")

const API = "https://phi-lab-server.vercel.app/api/v1/lab/issues"

  spinner.classList.remove("hidden");   
let allIssues = [];
async function loadAllIssues() {
    spinner.classList.remove("hidden");

    try {
        const res = await fetch(API);
        const data = await res.json();

        allIssues = data.data || [];

        
        updateCountAndDisplay("all");
    } catch (err) {
        console.error("API fetch error:", err);
    } finally {
        spinner.classList.add("hidden");
    }
}


function updateCountAndDisplay(type = "all") {

    let filteredIssues = allIssues;
    let count = allIssues.length;

    if (type === "open") {
        filteredIssues = allIssues.filter(i => i.status === "open");
        count = filteredIssues.length;
    } 
    else if (type === "closed") {
        filteredIssues = allIssues.filter(i => i.status === "closed");
        count = filteredIssues.length;
    }

   
    allbtn.innerText = count;

   
    displayIssues(filteredIssues);
}


function setupTabClick(btn, type) {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-btn").forEach(b => {
            b.classList.remove("bg-blue-600", "text-white");
        });

        btn.classList.add("bg-blue-600", "text-white");

        
        spinner.classList.remove("hidden");

        
        updateCountAndDisplay(type);

       
        spinner.classList.add("hidden");
    });
}


setupTabClick(btnall,   "all");
setupTabClick(btopen,   "open");
setupTabClick(btclosed, "closed");


loadAllIssues();


async function loadIssues(type = "all"){

  
const res = await fetch(API)
const data = await res.json()

let issues = data.data

spinner.classList.add("hidden");

if(type === "all"){

   
}

if(type === "open"){

    document.getElementById("issueCount").innerText = issues.filter(i => i.status === "open").length;

issues = issues.filter(i => i.status === "open")

}

if(type === "closed"){

    document.getElementById("issueCount").innerText = issues.filter(i => i.status === "closed").length;
issues = issues.filter(i => i.status === "closed")
}



displayIssues(issues)

}

loadIssues()

let togle = (id, type)=>{
   
    
    id.addEventListener("click", function(event){

       spinner.classList.remove("hidden")

  clickbtn = document.querySelectorAll(".tab-btn");
  
  
clickbtn.forEach(btn => btn.classList.remove("bg-blue-600","text-white"))

event.target.classList.add("bg-blue-600","text-white")

// loadIssues(type)

});

}
togle(btnall ,"all" )
togle(btopen, "open")
togle(btclosed, "closed")







// Display Issues Cards

function displayIssues(issues){

const container = document.getElementById("issuesContainer")


container.innerHTML = ""



issues.forEach(issue => {

const borderColor =
issue.status === "open"
? "border-green-500"
: "border-purple-500"

const backGroundColorHigh = issue.priority === "high" ? "bg-red-100 text-[#EF4444]" : "bg-gray-100" 

const backGroundColorMediun = issue.priority === "medium" ? "bg-yellow-100 text-[#F59E0B]" : "bg-gray-100"

const backGroundColorGray = issue.priority === "low" ? "bg-gray-100 text-[#9CA3AF]" : "bg-gray-100"



let labelsHTML = "";

issue.labels.forEach(label => {

let bgColor = "";

if(label === "bug"){
bgColor = "bg-[#FEECEC] text-[#EF4444]";
}
else if(label === "help wanted"){
bgColor = "bg-[#FDE68A] text-[#D97706]";
}
else{
bgColor = "bg-[#BBF7D0] text-[#00A96E]";
}

labelsHTML += `
<span class="px-2 py-1 text-xs rounded ${bgColor}">
${label}
</span>
`;

});

const image = issue.priority == "high" ? "assets/Open-Status.png" : "assets/Closed- Status .png"
// const imagemedium = issue.priority == "medium" ? "assets/Open-Status.png" : "assets/Closed- Status .png"
// const imagelow = issue.priority == "low" ? "assets/Closed- Status .png" : "assets/Closed- Status .png"

const card = `

<div onclick="openModal(${issue.id})"
class="bg-white p-4 rounded shadow border-t-4 ${borderColor}">

<div class="flex justify-between">
    <div >
        <img src="${image}" alt="" srcset="">
    </div>
    <div>
        <p class="rounded-xl uppercase px-8 ${backGroundColorHigh}  ${backGroundColorMediun} ${backGroundColorGray} p-[5px]"> ${issue.priority}</p>
    </div>
</div>

<h3 class="font-bold mb-2 mt-3">
${issue.title}
</h3>

<p class="text-gray-500 text-sm mb-2">
${issue.description}
</p>

<div class="flex gap-2 flex-wrap">
${labelsHTML || "No labels"}
</div>



<div class="text-sm text-gray-400">
#${issue.id} by ${issue.author}
</div>
<div class="text-sm text-gray-400">
assignee to ${issue.assignee} 
</div>
<div class="text-sm text-gray-400">
#updated at ${new Date(issue.createdAt).toLocaleDateString("en-US")}
</div>

</div>

`

container.innerHTML += card


})

}

// Modal (Issue Details Popup)
async function openModal(id){

const res = await fetch(
`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`
)

const data = await res.json()

document.getElementById("modalTitle").innerText = data.data.title
document.getElementById("modalDesc").innerText = data.data.description
document.getElementById("opened").innerText = data.data.status
document.getElementById("openby").innerText = data.data.status
document.getElementById("name").innerText = data.data.author
document.getElementById("date").innerText = new Date(data.data.createdAt).toLocaleDateString("en-US")

let labelsHTML = "";
data.data.labels.forEach(label => {

let bgColor = "";

if(label === "bug"){
bgColor = "bg-red-100 text-red-700";
}
else if(label === "help wanted"){
bgColor = "bg-[#FDE68A] text-[#D97706]";
}
else{
bgColor = "bg-[#BBF7D0] text-[#00A96E]";
}

labelsHTML += `
<span class="px-2 py-1 text-xs rounded ${bgColor}">
${label}
</span>
`;

});


document.getElementById("label").innerHTML = `${labelsHTML}`;

document.getElementById("assignee").innerText = data.data.assignee;
document.getElementById("high").innerText = data.data.priority;


document.getElementById("modal").classList.remove("hidden")

}


function closeModal(){
document.getElementById("modal").classList.add("hidden")
}



// Search Function
async function searchIssue(){

const text = document.getElementById("searchInput").value

const res = await fetch(
`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`
)

const data = await res.json()

displayIssues(data.data)

}

async function showallissuse(){

    const res = await fetch(API)
    const data = await res.json()

    let issuesall = data.data
    let total = issuesall.length
    console.log(total)

    allbtn.innerText= total
}
showallissuse()

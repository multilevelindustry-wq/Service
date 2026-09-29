import { db, configured } from "./firebase.js";
import { CATEGORIES } from "./categories.js";
window.CATEGORY_DATA = CATEGORIES;
import { collection, query, where, orderBy, limit, getDocs, doc, getDoc, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { watchAuth, logoutUser } from "./auth.js";

const demo = [
 {id:"d1",type:"services",category:"Home Services",subcategory:"Electrical Work",title:"Certified Electrician",description:"House wiring, repairs and installations.",state:"Lagos",city:"Ikeja",price:"From ₦15,000",phone:"08000000001"},
 {id:"d2",type:"jobs",category:"Company Jobs",subcategory:"Customer Service",title:"Customer Service Officer",description:"Full-time customer support role.",state:"Lagos",city:"Yaba",price:"₦180,000/month",phone:"08000000002"},
 {id:"d3",type:"sale",category:"Property",subcategory:"Houses for Sale",title:"3 Bedroom Detached House",description:"Modern home in a developed area.",state:"Enugu",city:"Enugu",price:"₦65,000,000",phone:"08000000003"},
 {id:"d4",type:"services",category:"Digital & Creative",subcategory:"Graphic Design",title:"Graphic Designer",description:"Logos, flyers, social media graphics.",state:"Enugu",city:"New Haven",price:"From ₦10,000",phone:"08000000004"},
 {id:"d5",type:"jobs",category:"Skilled Work",subcategory:"Plumber",title:"Experienced Plumber Needed",description:"Residential plumbing work.",state:"Enugu",city:"Independence Layout",price:"Negotiable",phone:"08000000005"},
 {id:"d6",type:"sale",category:"Vehicles",subcategory:"Cars",title:"Clean Toyota Camry",description:"Used vehicle in good condition.",state:"Rivers",city:"Port Harcourt",price:"₦18,500,000",phone:"08000000006"}
];

const esc = s => String(s ?? "").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
function typeLabel(t){return ({jobs:"Jobs",services:"Services",sale:"For Sale"})[t]||t}
function card(x){
  const img = x.imageUrl ? `<img src="${esc(x.imageUrl)}" alt="">` : `<span>${esc(typeLabel(x.type))}</span>`;
  return `<a class="card" href="listing.html?id=${encodeURIComponent(x.id)}">
    <div class="card-img">${img}</div><div class="card-body">
      <div class="card-title">${esc(x.title)}</div><div class="meta">${esc(x.subcategory||x.category)}</div>
      <div class="price">${esc(x.price||"Contact for price")}</div><span class="state-pill">📍 ${esc(x.state||"Nigeria")}</span>
    </div></a>`;
}
function rail(title,items,red=false,href="#"){
  return `<section class="section"><div class="section-head ${red?'red':''}"><h2>${esc(title)}</h2><a href="${href}">See All</a></div>
  <div class="rail">${items.length?items.map(card).join(""):`<div class="empty">No listings yet. Be the first to list one.</div>`}</div></section>`;
}
async function getListings({type,state,subcategory,search}={}){
  if(!configured) return demo.filter(x=>(!type||x.type===type)&&(!state||x.state.toLowerCase()===state.toLowerCase())&&(!subcategory||x.subcategory===subcategory)&&(!search||`${x.title} ${x.category} ${x.subcategory}`.toLowerCase().includes(search.toLowerCase())));
  try{
    let q;
    const ref=collection(db,"listings");
    // Keep the public query simple so a new Firebase project does not need
    // composite indexes before the first version works. Security rules ensure
    // only active listings are readable.
    q=query(ref,where("status","==","active"),limit(100));
    const snap=await getDocs(q);
    let out=snap.docs.map(d=>({id:d.id,...d.data()}));
    if(type) out=out.filter(x=>x.type===type);
    if(state) out=out.filter(x=>(x.state||"").toLowerCase()===state.toLowerCase());
    if(subcategory) out=out.filter(x=>x.subcategory===subcategory);
    if(search) out=out.filter(x=>`${x.title} ${x.category} ${x.subcategory} ${x.description}`.toLowerCase().includes(search.toLowerCase()));
    return out;
  }catch(e){ console.warn(e); return demo.filter(x=>(!type||x.type===type)&&(!state||x.state===state)); }
}
function pageParam(k){return new URLSearchParams(location.search).get(k)}

window.toggleMenu=()=>{const m=document.getElementById("mobileMenu"); if(m)m.style.display=m.style.display==="none"?"block":"none"}
window.runSearch=()=>{
  const q=document.getElementById("globalSearch")?.value.trim();

  if(!q) return;

  location.href=`search.html?q=${encodeURIComponent(q)}`;
};

async function renderHome(){
  const root=document.getElementById("homeSections"); if(!root)return;
  const all=await getListings({});
  const featured=all.slice(0,12);
  const jobs=all.filter(x=>x.type==="jobs").slice(0,12);
  const services=all.filter(x=>x.type==="services").slice(0,12);
  const sale=all.filter(x=>x.type==="sale").slice(0,12);
  root.innerHTML=`
   <div class="hero-rail">
 <div class="hero-cards">

    <div class="hero-track">

        <!-- SET 1 -->

        <a href="jobs.html" class="hero-card">

            <div class="hero-card-image">
                <img
                    src="https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=1200&q=85"
                    alt="Find a job near you"
                >
            </div>

            <div class="hero-card-content">
                <h2>Find a Job Near You</h2>
                <p>
                    Browse opportunities by state and category.
                </p>
            </div>

        </a>


        <a href="services.html" class="hero-card">

            <div class="hero-card-image">
                <img
                    src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=85"
                    alt="Book local services"
                >
            </div>

            <div class="hero-card-content">
                <h2>Book Local Services</h2>
                <p>
                    Find trusted people offering services near you.
                </p>
            </div>

        </a>


        <a href="sale.html" class="hero-card">

            <div class="hero-card-image">
                <img
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85"
                    alt="Property and items for sale"
                >
            </div>

            <div class="hero-card-content">
                <h2>Property &amp; Items</h2>
                <p>
                    Discover homes, land, vehicles and more.
                </p>
            </div>

        </a>


        <a href="upload.html" class="hero-card">

            <div class="hero-card-image">
                <img
                    src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85"
                    alt="List your offer on ZONGO"
                >
            </div>

            <div class="hero-card-content">
                <h2>List Your Offer</h2>
                <p>
                    Reach people searching in your state.
                </p>
            </div>

        </a>


        <!-- SET 2 — DUPLICATE FOR SEAMLESS LOOP -->

        <a href="jobs.html" class="hero-card">

            <div class="hero-card-image">
                <img
                    src="https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=1200&q=85"
                    alt="Find a job near you"
                >
            </div>

            <div class="hero-card-content">
                <h2>Find a Job Near You</h2>
                <p>
                    Browse opportunities by state and category.
                </p>
            </div>

        </a>


        <a href="services.html" class="hero-card">

            <div class="hero-card-image">
                <img
                    src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=85"
                    alt="Book local services"
                >
            </div>

            <div class="hero-card-content">
                <h2>Book Local Services</h2>
                <p>
                    Find trusted people offering services near you.
                </p>
            </div>

        </a>


        <a href="sale.html" class="hero-card">

            <div class="hero-card-image">
                <img
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85"
                    alt="Property and items for sale"
                >
            </div>

            <div class="hero-card-content">
                <h2>Property &amp; Items</h2>
                <p>
                    Discover homes, land, vehicles and more.
                </p>
            </div>

        </a>


        <a href="upload.html" class="hero-card">

            <div class="hero-card-image">
                <img
                    src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85"
                    alt="List your offer on ZONGO"
                >
            </div>

            <div class="hero-card-content">
                <h2>List Your Offer</h2>
                <p>
                    Reach people searching in your state.
                </p>
            </div>

        </a>

    </div>

</div>

   </div>
   <div class="mini-rail">
    ${["Company Jobs","Home Services","Property","Cars & Vehicles","Digital Services","Skilled Work","Land","Electronics"].map(x=>`<a class="mini-card" href="${x==="Company Jobs"?"jobs":x==="Home Services"?"services":"sale"}.html">${esc(x)}</a>`).join("")}
   </div>
   ${rail("Latest Listings",featured,false,"jobs.html")}
   ${rail("Jobs & Work Opportunities",jobs,true,"jobs.html")}
   ${rail("Services Near You",services,false,"services.html")}
   ${rail("Property & Items for Sale",sale,true,"sale.html")}
   <section class="section"><div class="section-head"><h2>Browse by State</h2><a href="states.html">All States</a></div><div class="state-grid">
   ${["Lagos","Enugu","Rivers","Anambra","Abuja","Ogun","Delta","Kano","Kaduna","Imo","Abia","Edo"].map(s=>`<a class="state-box" href="${s.toLowerCase().replaceAll(" ","-")}.html">${s}</a>`).join("")}</div></section>`;
}
async function renderCategory(){
 const type=document.body.dataset.type; const state=pageParam("state")||document.body.dataset.state||""; const search=pageParam("search")||"";
 const title=document.getElementById("pageTitle"); if(title) title.textContent=`${typeLabel(type)}${state?" in "+state:""}`;
 const listings=await getListings({type,state,search});
 const grid=document.getElementById("listingGrid"); if(grid) grid.innerHTML=listings.length?listings.map(card).join(""):`<div class="empty">No ${typeLabel(type).toLowerCase()} found${state?" in "+esc(state):""}. <a href="upload.html"><u>List one now.</u></a></div>`;
 const catBox=document.getElementById("categoryBox");
 if(catBox){
  const cats=window.CATEGORY_DATA?.[type]||{};
  catBox.innerHTML=Object.entries(cats).map(([cat,subs])=>`<div class="category-group"><h3>${esc(cat)}</h3><div class="chips">${subs.map(s=>`<a class="chip" href="${type}.html?subcategory=${encodeURIComponent(s)}${state?"&state="+encodeURIComponent(state):""}">${esc(s)}</a>`).join("")}</div></div>`).join("");
 }
}
async function renderState(){
 const state=document.body.dataset.state;
 const title=document.getElementById("stateTitle"); if(title) title.textContent=`ZONGO ${state}`;
 const intro=document.getElementById("stateIntro"); if(intro) intro.textContent=`Browse jobs, services and property available in ${state}.`;
 const wrap=document.getElementById("stateSections"); if(!wrap)return;
 const [jobs,services,sale]=await Promise.all([getListings({type:"jobs",state}),getListings({type:"services",state}),getListings({type:"sale",state})]);
 wrap.innerHTML=`
 ${rail(`Jobs in ${state}`,jobs,true,`jobs.html?state=${encodeURIComponent(state)}`)}
 ${rail(`Services in ${state}`,services,false,`services.html?state=${encodeURIComponent(state)}`)}
 ${rail(`Property & Items in ${state}`,sale,true,`sale.html?state=${encodeURIComponent(state)}`)}`;
}
async function renderListing(){
 const id=pageParam("id"); const root=document.getElementById("listingDetail"); if(!root)return;
 let x=demo.find(d=>d.id===id);
 if(configured && id){try{const s=await getDoc(doc(db,"listings",id)); if(s.exists())x={id:s.id,...s.data()}}catch(e){}}
 if(!x){root.innerHTML="<div class='empty'>Listing not found.</div>";return}
 root.innerHTML=`<div class="listing-photo">${x.imageUrl?`<img src="${esc(x.imageUrl)}" alt="">`:`<span>No image supplied</span>`}</div>
 <div><h1 class="detail-title">${esc(x.title)}</h1><div class="state-pill">📍 ${esc(x.state)}${x.city?" • "+esc(x.city):""}</div>
 <div class="detail-row"><b>Category:</b> ${esc(x.category)} → ${esc(x.subcategory)}</div>
 <div class="detail-row"><b>Price:</b> ${esc(x.price||"Contact for price")}</div>
 <div class="detail-row">${esc(x.description||"No description provided.")}</div>
 <div class="actions"><a class="primary" href="tel:${esc(x.phone||"")}">📞 Call</a>${x.phone?`<a class="secondary" href="https://wa.me/${x.phone.replace(/\D/g,"")}" target="_blank">WhatsApp</a>`:""}</div></div>`;
}
watchAuth(async user=>{
 const a=document.getElementById("accountLink");
 if(a){a.textContent=user?`👤 ${user.displayName||"Dashboard"}`:"👤 Sign in";a.href=user?"dashboard.html":"login.html"}
});
if(document.getElementById("homeSections"))renderHome();
if(document.getElementById("listingGrid"))renderCategory();
if(document.getElementById("stateSections"))renderState();
if(document.getElementById("listingDetail"))renderListing();

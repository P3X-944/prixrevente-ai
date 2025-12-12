// PrixReventeAI - JavaScript Principal
// Navigation & Gestion des pages

function showLanding(){hideAll();document.getElementById('landing').classList.remove('hidden');}
function showDashboard(){hideAll();document.getElementById('dashboard').classList.remove('hidden');initChart();}
function showEstimate(){hideAll();document.getElementById('estimate').classList.remove('hidden');}
function showHistory(){hideAll();document.getElementById('history').classList.remove('hidden');}
function showPricing(){hideAll();document.getElementById('pricing').classList.remove('hidden');}
function showResult(){hideAll();document.getElementById('result').classList.remove('hidden');}
function hideAll(){['landing','dashboard','estimate','history','pricing','result'].forEach(id=>{const el=document.getElementById(id);if(el)el.classList.add('hidden');});}

// Calcul de prix avec IA simulation
function calculatePrice(e){
    e.preventDefault();
    const productName=document.getElementById('productName').value;
    const condition=document.getElementById('condition').value;
    
    // Simulation analyse IA Perplexity
    let basePrice=Math.floor(Math.random()*100)+30;
    if(condition==='neuf')basePrice=Math.round(basePrice*1.15);
    else if(condition==='excellent')basePrice=Math.round(basePrice*1.05);
    else if(condition==='use')basePrice=Math.round(basePrice*0.75);
    
    // Mise à jour UI
    document.getElementById('recPrice').textContent=basePrice+'€';
    document.getElementById('range').textContent=Math.round(basePrice*0.8)+'€ - '+Math.round(basePrice*1.2)+'€';
    
    // Confettis
    for(let i=0;i<50;i++){
        const conf=document.createElement('div');
        conf.className='confetti';
        conf.style.left=Math.random()*100+'vw';
        conf.style.backgroundColor=['#3B82F6','#F97316','#10B981'][Math.floor(Math.random()*3)];
        document.body.appendChild(conf);
        setTimeout(()=>conf.remove(),3000);
    }
    
    // Sauvegarder dans historique localStorage
    const history=JSON.parse(localStorage.getItem('estimations')||'[]');
    history.unshift({productName,condition,price:basePrice,date:new Date().toISOString()});
    localStorage.setItem('estimations',JSON.stringify(history.slice(0,10)));
    
    showResult();
}

// Init graphique Chart.js
let chartInstance=null;
function initChart(){
    const ctx=document.getElementById('activityChart');
    if(!ctx)return;
    if(chartInstance)chartInstance.destroy();
    chartInstance=new Chart(ctx,{
        type:'line',
        data:{
            labels:['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'],
            datasets:[{
                label:'Estimations',
                data:[2,3,1,4,2,5,3],
                borderColor:'rgb(59,130,246)',
                backgroundColor:'rgba(59,130,246,0.1)',
                tension:0.4
            }]
        },
        options:{responsive:true,plugins:{legend:{display:false}}}
    });
}

// Charger historique au démarrage
document.addEventListener('DOMContentLoaded',()=>{
    const history=JSON.parse(localStorage.getItem('estimations')||'[]');
    if(history.length>0){
        const container=document.getElementById('recentHistory');
        if(container)container.innerHTML=history.slice(0,5).map(h=>`
            <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div><p class="font-bold">${h.productName}</p><p class="text-sm text-gray-500">${new Date(h.date).toLocaleDateString('fr-FR')}</p></div>
                <p class="font-bold text-blue-600">${h.price}€</p>
            </div>
        `).join('');
    }
});

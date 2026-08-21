document.querySelector('#loginForm').addEventListener('submit', async event => {
  event.preventDefault(); const form = event.currentTarget; const status = document.querySelector('#loginStatus'); const button = form.querySelector('button'); status.textContent=''; status.className='form-status'; button.disabled=true; button.textContent='Verificando…';
  try { const response = await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(new FormData(form)))}); const result=await response.json(); if(!response.ok) throw new Error(result.message); location.href='/admin'; }
  catch(error){ status.textContent=error.message; status.classList.add('error'); button.disabled=false; button.textContent='Iniciar sesión'; }
});

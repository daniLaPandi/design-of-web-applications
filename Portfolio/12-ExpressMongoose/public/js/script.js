// public/js/script.js
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggle-view');
  const driverList = document.getElementById('driver-list');
  const teamList = document.getElementById('team-list');
  const form = document.querySelector('form[action="/driver"]');

  toggleBtn.addEventListener('click', () => {
    if (driverList.style.display === 'none') {
      // We are switching back to the DRIVER view
      driverList.style.display = '';
      teamList.style.display = 'none';
      toggleBtn.textContent = 'Show Teams'; // Change button text back
    } else {
      // We are switching to the TEAM view
      driverList.style.display = 'none';
      teamList.style.display = '';
      toggleBtn.textContent = 'Show Drivers'; // Change button text
    }
  });

  // Delegate clicks for edit and delete buttons
  document.body.addEventListener('click', async (ev) => {
    const t = ev.target;
    if (t.classList.contains('edit-btn')) {
      const id = t.dataset.id;
      // Find row
      const row = document.querySelector(`tr[data-driver-id="${id}"]`);
      if (!row) return;
      // Option: populate form with driver's data
      const num = row.querySelector('.cell-num').innerText.trim();
      const code = row.querySelector('.cell-code').innerText.trim();
      const nameParts = row.querySelector('.cell-name').innerText.trim().split(' ');
      const forename = nameParts[0] || '';
      const surname = nameParts.slice(1).join(' ') || '';
      const dob = row.querySelector('.cell-dob').innerText.trim();
      const nationality = row.querySelector('.cell-nationality').innerText.trim();
      const team = row.querySelector('.cell-team').innerText.trim();

      // fill form
      form.querySelector('#number').value = num;
      form.querySelector('#code').value = code;
      form.querySelector('#name').value = forename;
      form.querySelector('#lname').value = surname;
      // dob field expects yyyy-mm-dd
      if (dob) form.querySelector('#dob').value = dob;
      form.querySelector('#url').value = row.querySelector('.cell-url') ? row.querySelector('.cell-url').innerText.trim() : '';
      form.querySelector('#nation').value = nationality;
      // set team select; if team isn't in the list, add it
      const teamSelect = form.querySelector('#team');
      if (![...teamSelect.options].some(o => o.value === team)) {
        const opt = document.createElement('option');
        opt.value = team;
        opt.text = team;
        teamSelect.add(opt);
      }
      teamSelect.value = team;

      // change submit action to update via POST to same endpoint (server handles upsert)
      // store driver id in a dataset so we can later use PUT if desired
      form.dataset.editingId = id;
      form.querySelector('input[type="submit"]').value = 'Save Driver';
      window.scrollTo({ top: form.offsetTop, behavior: 'smooth' });
    }

    if (t.classList.contains('delete-btn')) {
      const id = t.dataset.id;
      if (!confirm('Delete this driver?')) return;
      try {
        const resp = await fetch(`/driver/${id}`, { method: 'DELETE' });
        if (resp.ok) location.reload();
        else alert('Delete failed');
      } catch (err) {
        console.error(err);
        alert('Delete failed');
      }
    }
  });

  // Intercept form submit to either create or update
  form.addEventListener('submit', async (ev) => {
    // let server handle the normal POST for create/update by num
    // but if editingId present we can also call PUT to update in place
    const editingId = form.dataset.editingId;
    if (!editingId) return; // let normal submit go (browser POST)
    ev.preventDefault();
    const formData = new FormData(form);
    const payload = {};
    formData.forEach((v, k) => payload[k] = v);
    // If dob is in dd/mm/yyyy convert to yyyy-mm-dd if necessary (form already supplies correct)
    try {
      const resp = await fetch(`/driver/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          number: payload.number,
          code: payload.code,
          forename: payload.name,
          surname: payload.lname,
          dob: payload.dob,
          nationality: payload.nation,
          team: payload.team,
          url: payload.url
        })
      });
      if (!resp.ok) throw new Error('Update failed');
      // reset editing state and reload to reflect changes
      delete form.dataset.editingId;
      form.querySelector('input[type="submit"]').value = 'Add Driver';
      location.reload();
    } catch (err) {
      console.error(err);
      alert('Update failed');
    }
  });

  // Team edit-in-place: convert cells to inputs on click of team edit button
  document.querySelectorAll('#team-list .edit-btn').forEach(btn => {
    btn.addEventListener('click', async (ev) => {
      const tr = btn.closest('tr');
      const id = btn.dataset.id;
      // turn the name and nationality and url cells into inputs
      ['td:nth-child(2)', 'td:nth-child(3)', 'td:nth-child(4)'].forEach((sel) => {
        const cell = tr.querySelector(sel);
        if (!cell) return;
        const text = cell.innerText.trim();
        cell.dataset.orig = text;
        cell.innerHTML = `<input class="team-edit-input" value="${text}" />`;
      });
      // change button to save
      btn.textContent = 'Save';
      btn.classList.remove('edit-btn');
      btn.classList.add('save-team-btn');

      btn.addEventListener('click', async (ev2) => {
        // gather new values
        const inputs = tr.querySelectorAll('.team-edit-input');
        const name = inputs[0].value;
        const nat = inputs[1].value;
        const url = inputs[2].value;
        try {
          const resp = await fetch(`/team/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, nationality: nat, url })
          });
          if (!resp.ok) throw new Error('Save failed');
          location.reload();
        } catch (err) {
          console.error(err);
          alert('Save failed');
        }
      }, { once: true });
    });
  });

});
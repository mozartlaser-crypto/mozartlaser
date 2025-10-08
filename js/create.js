// js/create.js
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const steps = Array.from(document.querySelectorAll('.step'));
    const nextButtons = Array.from(document.querySelectorAll('.next-step'));
    const prevButtons = Array.from(document.querySelectorAll('.prev-step'));
    const productSelect = document.getElementById('product-type');
    const plaqueSelect = document.getElementById('plaque-shape');
    const summaryDiv = document.getElementById('summary');
    const totalPriceEl = document.getElementById('total-price');
    const step2Desc = document.getElementById('step2-desc');
    const addToCartBtn = document.getElementById('add-to-cart');
    const uploadFileInput = document.getElementById('upload-file');
    const deleteFileBtn = document.getElementById('delete-file');

    const prices = {
      coin: 25,
      bookmark: 35,
      plaque: 50,
      shapes: { 'rect-portrait': 0, 'rect-landscape': 0, square: 5, none: 0 }
    };
    let currentPrice = 0;

    if (deleteFileBtn && uploadFileInput) {
      deleteFileBtn.addEventListener('click', () => uploadFileInput.value = '');
    }

    function showStep(id) {
      steps.forEach(s => s.classList.remove('active'));
      const el = document.getElementById(id);
      if (el) el.classList.add('active');
      updatePrice();
      if (id === 'step4') updateSummary();
    }

    function updatePrice() {
      let price = 0;
      const product = productSelect.value;
      const shape = plaqueSelect.value;

      if (product && prices[product] !== undefined) price += prices[product];
      if (product === 'plaque' && shape) price += prices.shapes[shape] || 0;

      currentPrice = price;
      totalPriceEl.textContent = `Total: $${price.toFixed(2)}`;
    }

    function updateSummary() {
      const product = productSelect.value || 'N/A';
      const shape = plaqueSelect.value || 'N/A';
      const text = document.getElementById('custom-text').value.trim();
      const location = document.getElementById('text-location').value.trim();
      const desc = document.getElementById('additional-desc').value.trim();
      const file = uploadFileInput.files[0];
      const fileName = file ? file.name : 'No file uploaded';

      let html = `<p><strong>Product:</strong> ${product}</p>`;
      if (product === 'plaque') html += `<p><strong>Shape:</strong> ${shape}</p>`;
      html += `<p><strong>Engraved Text:</strong> ${text || 'None'}</p>`;
      html += `<p><strong>Placement:</strong> ${location || 'Not specified'}</p>`;
      html += `<p><strong>Additional Description:</strong> ${desc || 'None'}</p>`;
      html += `<p><strong>Design File:</strong> ${fileName}</p>`;
      html += `<p style="margin-top:10px;"><strong>Price:</strong> $${currentPrice.toFixed(2)}</p>`;
      summaryDiv.innerHTML = html;
    }

    function validateStep(stepEl) {
      if (!stepEl) return true;
      let ok = true;
      const requiredFields = Array.from(stepEl.querySelectorAll('select[required], input[required], textarea[required]'));

      requiredFields.forEach(field => {
        if (field.id === 'plaque-shape') {
          if (!field.value) { field.classList.add('error'); ok = false; return; } 
          else { field.classList.remove('error'); }
        }
        if (field.id === 'upload-file' && !uploadFileInput.files[0]) { field.classList.add('error'); ok = false; return; }
        if (!field.value.trim() && field.id !== 'upload-file') { field.classList.add('error'); ok = false; } 
        else { field.classList.remove('error'); }
      });

      if (!ok) alert('Please fill out all required fields (including uploading a design image).');
      return ok;
    }

    // NEXT / PREV BUTTONS
    nextButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const currentStep = btn.closest('.step');
        if (!validateStep(currentStep)) return;
        showStep(btn.dataset.next);
      });
    });

    prevButtons.forEach(btn => {
      btn.addEventListener('click', () => showStep(btn.dataset.prev));
    });

    // PRODUCT SELECT
    if (productSelect) {
      productSelect.addEventListener('change', () => {
        if (productSelect.value !== 'plaque') {
          plaqueSelect.value = 'none';
          step2Desc.textContent = "You did not select a plaque; 'I did not choose plaque' will be used.";
        } else if (plaqueSelect.value === 'none') plaqueSelect.value = '';
        updatePrice();
      });
    }

    if (plaqueSelect) {
      plaqueSelect.addEventListener('change', updatePrice);
      plaqueSelect.addEventListener('input', updatePrice);
    }

    document.querySelectorAll('.input-field').forEach(inp => {
      inp.addEventListener('input', () => inp.classList.remove('error'));
      inp.addEventListener('change', () => inp.classList.remove('error'));
    });

    // ADD TO CART & FORM SUBMIT
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', () => {
        const s1 = document.getElementById('step1');
        const s2 = document.getElementById('step2');
        const s3 = document.getElementById('step3');
        if (!validateStep(s1) || !validateStep(s2) || !validateStep(s3)) {
          if (!validateStep(s1)) showStep('step1');
          else if (!validateStep(s2)) showStep('step2');
          else showStep('step3');
          return;
        }

        updateSummary();

        // Fill hidden form
        document.getElementById('f-product').value = productSelect.value;
        document.getElementById('f-shape').value = plaqueSelect.value;
        document.getElementById('f-text').value = document.getElementById('custom-text').value.trim();
        document.getElementById('f-location').value = document.getElementById('text-location').value.trim();
        document.getElementById('f-description').value = document.getElementById('additional-desc').value.trim();
        document.getElementById('f-price').value = currentPrice.toFixed(2);
        if (uploadFileInput.files[0]) document.getElementById('f-design').files = uploadFileInput.files;

        // Add to cart logic
        const details = [
          `Type: ${productSelect.value}`,
          productSelect.value==='plaque'?`Shape: ${plaqueSelect.value}`:'',
          document.getElementById('custom-text').value?`Text: "${document.getElementById('custom-text').value}"`:'',
        ].filter(Boolean).join(', ');

        if (window.addToCart) window.addToCart(`Custom Engraving (${details})`, currentPrice);
        if (typeof window.openCartPanel === 'function') window.openCartPanel();

        // Submit form to hidden iframe (silent)
        document.getElementById('sendForm').submit();
        alert('Order added to cart! You may exit create mode');
      });
    }

    showStep('step1');
  });
})();
// js/create.js
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    // Steps & controls
    const steps = Array.from(document.querySelectorAll('.step'));
    const nextButtons = Array.from(document.querySelectorAll('.next-step'));
    const prevButtons = Array.from(document.querySelectorAll('.prev-step'));

    // Inputs
    const productSelect = document.getElementById('product-type');
    const plaqueSelect = document.getElementById('plaque-shape');
    const summaryDiv = document.getElementById('summary');
    const totalPriceEl = document.getElementById('total-price');
    const step2Desc = document.getElementById('step2-desc');
    const addToCartBtn = document.getElementById('add-to-cart');

    const uploadFileInput = document.getElementById('upload-file');
    const deleteFileBtn = document.getElementById('delete-file');
    const textField = document.getElementById('custom-text');
    const fontSelect = document.getElementById('font-select');
    const filePlacementInput = document.getElementById('file-placement');
    const additionalDesc = document.getElementById('additional-desc');

    // hidden form fields
    const sendForm = document.getElementById('sendForm');
    const hiddenProduct = document.getElementById('f-product');
    const hiddenShape = document.getElementById('f-shape');
    const hiddenText = document.getElementById('f-text');
    const hiddenFont = document.getElementById('f-font');
    const hiddenLocation = document.getElementById('f-location');
    const hiddenFilePlacement = document.getElementById('f-file-placement');
    const hiddenDescription = document.getElementById('f-description');
    const hiddenPrice = document.getElementById('f-price');
    let hiddenFileInput = document.getElementById('f-design'); // file input inside form

    // price table
    const prices = {
      coin: 25,
      bookmark: 35,
      plaque: 50,
      shapes: { 'rect-portrait': 0, 'rect-landscape': 0, 'square': 5, 'none': 0 }
    };
    let currentPrice = 0;

    // ensure hidden file input exists
    if (!hiddenFileInput) {
      hiddenFileInput = document.createElement('input');
      hiddenFileInput.type = 'file';
      hiddenFileInput.name = 'design_file';
      hiddenFileInput.id = 'f-design';
      hiddenFileInput.style.display = 'none';
      sendForm.appendChild(hiddenFileInput);
    }

    // Delete file button
    if (deleteFileBtn && uploadFileInput) {
      deleteFileBtn.addEventListener('click', () => {
        uploadFileInput.value = '';
      });
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
      const product = productSelect && productSelect.value;
      const shape = plaqueSelect && plaqueSelect.value;

      if (product && prices[product] !== undefined) {
        price += prices[product] || 0;
      }
      if (product === 'plaque' && shape) {
        price += (prices.shapes[shape] || 0);
      }

      currentPrice = price;
      if (totalPriceEl) totalPriceEl.textContent = `Total: $${price.toFixed(2)}`;
    }

    function updateSummary() {
      const product = productSelect.value || 'N/A';
      const shape = plaqueSelect.value || 'N/A';
      const text = textField.value.trim();
      const location = document.getElementById('text-location') ? document.getElementById('text-location').value.trim() : '';
      const desc = additionalDesc.value.trim();
      const placement = filePlacementInput ? filePlacementInput.value.trim() : '';
      const file = uploadFileInput.files[0];
      const fileName = file ? file.name : 'No file uploaded';

      let html = `<p><strong>Product:</strong> ${escapeHtml(product)}</p>`;
      if (product === 'plaque') {
        html += `<p><strong>Shape:</strong> ${escapeHtml(shape)}</p>`;
      }
      html += `<p><strong>Engraved Text:</strong> ${escapeHtml(text || 'None')}</p>`;
      html += `<p><strong>Font:</strong> ${escapeHtml(fontSelect.value || 'N/A')}</p>`;
      html += `<p><strong>Placement:</strong> ${escapeHtml(location || 'Not specified')}</p>`;
      html += `<p><strong>File Placement:</strong> ${escapeHtml(placement || 'N/A')}</p>`;
      html += `<p><strong>Additional Description:</strong> ${escapeHtml(desc || 'None')}</p>`;
      html += `<p><strong>Design File:</strong> ${escapeHtml(fileName)}</p>`;
      html += `<p style="margin-top:10px;"><strong>Price:</strong> $${currentPrice.toFixed(2)}</p>`;

      summaryDiv.innerHTML = html;
    }

    function escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }

    function validateStep(stepEl) {
      if (!stepEl) return true;

      // Step 2 must have a selection always
      if (stepEl.id === 'step2') {
        if (!plaqueSelect.value || plaqueSelect.value.trim() === '') {
          plaqueSelect.classList.add('error');
          alert('Please choose a plaque shape (or "I did not choose plaque").');
          return false;
        }
        plaqueSelect.classList.remove('error');
        return true;
      }

      // Step 3 special rules: at least one of (text, uploaded file, file placement, additional desc)
      if (stepEl.id === 'step3') {
        const text = textField.value.trim();
        const design = uploadFileInput.files && uploadFileInput.files.length > 0;
        const placement = filePlacementInput.value.trim();
        const desc = additionalDesc.value.trim();

        if (!text && !design && !placement && !desc) {
          alert("Please fill at least one field on this step: text, upload a design, file placement, or additional description.");
          // highlight the inputs minimally
          textField.classList.add('error');
          uploadFileInput.classList.add('error');
          filePlacementInput.classList.add('error');
          additionalDesc.classList.add('error');
          return false;
        }

        // If text is present, font must be selected
        if (text && (!fontSelect.value || fontSelect.value.trim() === '')) {
          fontSelect.classList.add('error');
          alert("Please select a font when providing engraved text.");
          return false;
        } else {
          fontSelect.classList.remove('error');
        }

        // remove error highlights if okay
        textField.classList.remove('error');
        uploadFileInput.classList.remove('error');
        filePlacementInput.classList.remove('error');
        additionalDesc.classList.remove('error');

        return true;
      }

      // Default: ensure required inputs within the step are not empty
      let ok = true;
      const required = Array.from(stepEl.querySelectorAll('select[required], input[required], textarea[required]'));
      required.forEach(field => {
        const val = (field.value || '').toString().trim();
        if (!val) {
          field.classList.add('error');
          ok = false;
        } else {
          field.classList.remove('error');
        }
      });

      if (!ok) alert('Please fill out all required fields for this step.');
      return ok;
    }

    // NEXT / PREV BUTTONS
    nextButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const currentStep = btn.closest('.step');
        if (!validateStep(currentStep)) return;
        const nextId = btn.dataset.next;
        showStep(nextId);
      });
    });

    prevButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const prevId = btn.dataset.prev;
        if (prevId) showStep(prevId);
      });
    });

    // Product change behavior
    if (productSelect) {
      productSelect.addEventListener('change', () => {
        if (productSelect.value !== 'plaque') {
          // default explicit 'none' so step2 is still required
          plaqueSelect.value = 'none';
          if (step2Desc) step2Desc.textContent = "You did not select a plaque; 'I did not choose plaque' will be used.";
        } else if (plaqueSelect.value === 'none') {
          plaqueSelect.value = '';
        }
        updatePrice();
      });
    }

    if (plaqueSelect) {
      plaqueSelect.addEventListener('change', updatePrice);
      plaqueSelect.addEventListener('input', updatePrice);
    }

    // remove error highlight on input
    document.querySelectorAll('.input-field').forEach(inp => {
      inp.addEventListener('input', () => inp.classList.remove('error'));
      inp.addEventListener('change', () => inp.classList.remove('error'));
    });

    // Add to Cart and form submission (silent)
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

        // Fill hidden form fields
        hiddenProduct.value = productSelect.value || '';
        hiddenShape.value = plaqueSelect.value || '';
        hiddenText.value = textField.value.trim() || '';
        hiddenFont.value = fontSelect.value || '';
        hiddenLocation.value = (document.getElementById('text-location') ? document.getElementById('text-location').value.trim() : '');
        hiddenFilePlacement.value = (filePlacementInput ? filePlacementInput.value.trim() : '');
        hiddenDescription.value = additionalDesc.value.trim() || '';
        hiddenPrice.value = currentPrice.toFixed(2);

        // Handle file copy into hidden form using DataTransfer (if available)
        try {
          // ensure hidden file input exists in the form
          let targetFileInput = document.getElementById('f-design');
          if (!targetFileInput) {
            targetFileInput = document.createElement('input');
            targetFileInput.type = 'file';
            targetFileInput.name = 'design_file';
            targetFileInput.id = 'f-design';
            targetFileInput.style.display = 'none';
            sendForm.appendChild(targetFileInput);
          }

          // replace/remove old file input to clear previous files if none selected
          if (!uploadFileInput.files || uploadFileInput.files.length === 0) {
            // clear existing by replacing node
            const newInput = targetFileInput.cloneNode(false);
            newInput.id = 'f-design';
            newInput.name = 'design_file';
            newInput.style.display = 'none';
            targetFileInput.parentNode.replaceChild(newInput, targetFileInput);
          } else {
            // copy files to hidden file input
            const dt = new DataTransfer();
            for (let i = 0; i < uploadFileInput.files.length; i++) {
              dt.items.add(uploadFileInput.files[i]);
            }
            // get refreshed element
            const refreshedTarget = document.getElementById('f-design');
            refreshedTarget.files = dt.files;
          }
        } catch (err) {
          // DataTransfer may not be supported in some browsers; still proceed without attaching file (rare)
          console.error('File copy to hidden form failed:', err);
        }

        // Submit hidden form silently to FormBackend (target is hidden iframe)
        try {
          sendForm.submit();
        } catch (err) {
          console.error('Hidden form submit error:', err);
        }

        // Add to cart logic (existing global function)
        const details = [
          `Type: ${productSelect.value}`,
          productSelect.value === 'plaque' ? `Shape: ${plaqueSelect.value}` : '',
          textField.value ? `Text: "${textField.value}"` : ''
        ].filter(Boolean).join(', ');

        if (window.addToCart && typeof window.addToCart === 'function') {
          window.addToCart(`Custom Engraving (${details})`, currentPrice);
        }
        if (typeof window.openCartPanel === 'function') window.openCartPanel();

        alert('Order added to cart and submitted to the shop. You may exit create mode.');
        // Optionally return to step1 so user can create another item
        showStep('step1');
      });
    }

    // Font behavior: always enabled but only required if text is present
    if (textField && fontSelect) {
      fontSelect.disabled = false;
      textField.addEventListener('input', () => {
        fontSelect.required = textField.value.trim() !== '';
      });
    }

    // Initial UI state
    updatePrice();
    showStep('step1');
  });
})();
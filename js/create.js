document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const steps = document.querySelectorAll('.step');
  const modeCustomize = document.getElementById('mode-customize');
  const modeFull = document.getElementById('mode-full');
  const selectExisting = document.getElementById('select-existing');
  const selectExistingLabel = document.getElementById('select-existing-label');
  const step1Next = document.getElementById('step1-next');

  // Full flow fields
  const textField = document.getElementById('custom-text');
  const fontSelect = document.getElementById('font-select');
  const textLocation = document.getElementById('text-location');
  const uploadFileInput = document.getElementById('upload-file');
  const deleteFileBtn = document.getElementById('delete-file');
  const filePlacementInput = document.getElementById('file-placement');
  const additionalDesc = document.getElementById('additional-desc');

  // Customize fields
  const selectedProductText = document.getElementById('selected-product-text');
  const customChanges = document.getElementById('custom-changes');
  const uploadFileCustom = document.getElementById('upload-file-custom');
  const deleteFileCustom = document.getElementById('delete-file-custom');
  const filePlacementCustom = document.getElementById('file-placement-custom');

  // Review & hidden
  const summary = document.getElementById('summary');
  const summaryCustom = document.getElementById('summary_custom');
  const totalPriceEl = document.getElementById('total-price');
  const totalPriceCustomEl = document.getElementById('total-price-custom');

  const sendForm = document.getElementById('sendForm');
  const hiddenFlowType = document.getElementById('f-flow-type');
  const hiddenProduct = document.getElementById('f-product');
  const hiddenShape = document.getElementById('f-shape');
  const hiddenText = document.getElementById('f-text');
  const hiddenFont = document.getElementById('f-font');
  const hiddenLocation = document.getElementById('f-location');
  const hiddenFilePlacement = document.getElementById('f-file-placement');
  const hiddenDescription = document.getElementById('f-description');
  const hiddenSelectedProduct = document.getElementById('f-selected-product');
  const hiddenCustomChanges = document.getElementById('f-custom-changes');
  const hiddenCustomFilePlacement = document.getElementById('f-custom-file-placement');
  const hiddenPrice = document.getElementById('f-price');
  const hiddenEmail = document.getElementById('f-email');

  // Hidden file input
  let hiddenFileInput = document.getElementById('f-design');
  if (!hiddenFileInput) {
    hiddenFileInput = document.createElement('input');
    hiddenFileInput.type = 'file';
    hiddenFileInput.name = 'design_file';
    hiddenFileInput.id = 'f-design';
    hiddenFileInput.style.display = 'none';
    sendForm.appendChild(hiddenFileInput);
  }

  // Prices
  const prices = {
    'Plaque (Portrait)': 50,
    'Plaque (Landscape)': 50,
    'Coin': 25,
    'Wallet': 35,
    'Cross with Scripture': 50,
    'Train Plaque': 50,
    'Leather Wallet': 35,
    default: 50
  };
  let currentPrice = prices.default;

  // Helpers
  function showStep(id) {
    steps.forEach(s => s.classList.remove('active'));
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
    updatePrice();
    if (id === 'step3') updateSummary();
    if (id === 'step3_custom') updateSummaryCustom();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function populateSelectForMode() {
    if (modeFull.checked) {
      selectExistingLabel.textContent = "Select product type:";
      selectExisting.innerHTML = `
        <option value="">-- Select a product type --</option>
        <option value="Plaque (Portrait)">Plaque (Portrait)</option>
        <option value="Plaque (Landscape)">Plaque (Landscape)</option>
        <option value="Coin">Coin</option>
        <option value="Wallet">Wallet</option>
      `;
    } else {
      selectExistingLabel.textContent = "If customizing, pick a product:";
      selectExisting.innerHTML = `
        <option value="">-- Select a product to customize (optional) --</option>
        <option value="Cross with Scripture">Cross with Scripture — Plaque</option>
        <option value="Train Plaque">Train Plaque — Plaque</option>
        <option value="Leather Wallet">Leather Wallet — Coin-sized</option>
      `;
    }
    selectedProductText.textContent = selectExisting.value || 'None';
  }

  function updatePrice() {
    const val = selectExisting.value;
    currentPrice = (val && prices[val] !== undefined) ? prices[val] : prices.default;
    const display = currentPrice.toFixed ? currentPrice.toFixed(2) : '0.00';
    if (totalPriceEl) totalPriceEl.textContent = `Total: $${display}`;
    if (totalPriceCustomEl) totalPriceCustomEl.textContent = `Total: $${display}`;
  }

  function escapeHtml(s) {
    if (!s) return '';
    return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;')
                    .replace(/'/g,'&#39;').replace(/</g,'&lt;')
                    .replace(/>/g,'&gt;');
  }

  function updateSummary() {
    const product = selectExisting.value || 'N/A';
    const text = textField.value.trim() || '';
    const font = fontSelect.value || '';
    const location = textLocation.value.trim() || '';
    const placement = filePlacementInput.value.trim() || '';
    const desc = additionalDesc.value.trim() || '';
    const file = uploadFileInput && uploadFileInput.files && uploadFileInput.files[0];
    const fileName = file ? file.name : 'No file uploaded';
    let html = `<p><strong>Product / Type:</strong> ${escapeHtml(product)}</p>`;
    html += `<p><strong>Engraved Text:</strong> ${escapeHtml(text || 'None')}</p>`;
    html += `<p><strong>Font:</strong> ${escapeHtml(font || 'N/A')}</p>`;
    html += `<p><strong>Text Placement:</strong> ${escapeHtml(location || 'Not specified')}</p>`;
    html += `<p><strong>File Placement:</strong> ${escapeHtml(placement || 'N/A')}</p>`;
    html += `<p><strong>Additional Description:</strong> ${escapeHtml(desc || 'None')}</p>`;
    html += `<p><strong>Design File:</strong> ${escapeHtml(fileName)}</p>`;
    html += `<p style="margin-top:10px;"><strong>Price:</strong> $${currentPrice.toFixed(2)}</p>`;
    summary.innerHTML = html;
  }

  function updateSummaryCustom() {
    const selected = selectExisting.value || 'None';
    const changes = customChanges.value.trim() || '';
    const placement = filePlacementCustom.value.trim() || '';
    const file = uploadFileCustom && uploadFileCustom.files && uploadFileCustom.files[0];
    const fileName = file ? file.name : 'No file uploaded';
    let html = `<p><strong>Selected Product:</strong> ${escapeHtml(selected)}</p>`;
    html += `<p><strong>Requested Changes:</strong> ${escapeHtml(changes || 'None')}</p>`;
    html += `<p><strong>File Placement:</strong> ${escapeHtml(placement || 'N/A')}</p>`;
    html += `<p><strong>Design File:</strong> ${escapeHtml(fileName)}</p>`;
    html += `<p style="margin-top:10px;"><strong>Price:</strong> $${currentPrice.toFixed(2)}</p>`;
    summaryCustom.innerHTML = html;
  }

  function copyFileIntoHiddenInput(sourceInput) {
    try {
      const files = sourceInput && sourceInput.files ? sourceInput.files : null;
      let target = document.getElementById('f-design');
      if (!target) {
        target = document.createElement('input');
        target.type = 'file';
        target.name = 'design_file';
        target.id = 'f-design';
        target.style.display = 'none';
        sendForm.appendChild(target);
      }

      if (!files || files.length === 0) {
        const newInput = target.cloneNode(false);
        newInput.id = 'f-design';
        newInput.name = 'design_file';
        newInput.style.display = 'none';
        target.parentNode.replaceChild(newInput, target);
      } else {
        const dt = new DataTransfer();
        for (let i = 0; i < files.length; i++) dt.items.add(files[i]);
        const refreshed = document.getElementById('f-design');
        refreshed.files = dt.files;
      }
    } catch (err) {
      console.error('File copy failed', err);
    }
  }

  // Validation
  function validateFullStep2() {
    const txt = textField.value.trim();
    const hasFile = uploadFileInput.files && uploadFileInput.files.length > 0;
    const placement = filePlacementInput.value.trim();
    const desc = additionalDesc.value.trim();
    if (!txt && !hasFile && !placement && !desc) {
      alert("Please fill at least one of: engraved text, upload file, file placement, or additional description.");
      return false;
    }
    if (txt && (!fontSelect.value || fontSelect.value.trim() === '')) {
      alert('Please choose a font when adding engraved text.');
      fontSelect.classList.add('error');
      return false;
    }
    fontSelect.classList.remove('error');
    return true;
  }

  function validateCustomizeStep2() {
    const changes = customChanges.value.trim();
    const hasFile = uploadFileCustom.files && uploadFileCustom.files.length > 0;
    const placement = filePlacementCustom.value.trim();
    if (!changes && !hasFile && !placement) {
      alert('Please describe requested changes, or upload a file (at least one).');
      return false;
    }
    return true;
  }

  function validateVerification(nameEl, emailEl) {
    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    if (!name || !email) {
      alert("Please fill out your name and email before adding to cart.");
      if (!name) nameEl.classList.add("error");
      if (!email) emailEl.classList.add("error");
      return false;
    }
    nameEl.classList.remove("error");
    emailEl.classList.remove("error");
    return true;
  }

  // Mode change
  modeCustomize.addEventListener('change', populateSelectForMode);
  modeFull.addEventListener('change', populateSelectForMode);

  // Update product and price on change
  selectExisting.addEventListener('change', () => {
    selectedProductText.textContent = selectExisting.value || 'None';
    updatePrice();
  });

  // File deletes
  if (deleteFileBtn) deleteFileBtn.addEventListener('click', () => { if (uploadFileInput) uploadFileInput.value = ''; updateSummary(); });
  if (deleteFileCustom) deleteFileCustom.addEventListener('click', () => { if (uploadFileCustom) uploadFileCustom.value = ''; updateSummaryCustom(); });

  // Step 1 branching
  step1Next.addEventListener('click', () => {
    const mode = modeFull.checked ? 'full' : 'customize';
    if (mode === 'customize') {
      hiddenFlowType.value = 'customize';
      selectedProductText.textContent = selectExisting.value || 'None';
      showStep('step2_custom');
    } else {
      hiddenFlowType.value = 'full';
      hiddenSelectedProduct.value = '';
      showStep('step2');
    }
  });

  // Next / Prev buttons
  document.querySelectorAll('.next-step').forEach(btn => {
    if (btn.id === 'step1-next') return;
    btn.addEventListener('click', e => {
      const current = e.target.closest('.step');
      if (!current) return;
      if (current.id === 'step2' && !validateFullStep2()) return;
      if (current.id === 'step2_custom' && !validateCustomizeStep2()) return;
      const next = btn.dataset.next;
      if (next) showStep(next);
    });
  });

  document.querySelectorAll('.prev-step').forEach(btn => {
    btn.addEventListener('click', e => {
      const prev = btn.dataset.prev;
      if (prev) showStep(prev);
    });
  });

  // Update summaries
  [selectExisting, textField, fontSelect, textLocation, filePlacementInput, additionalDesc].forEach(el => { if (!el) return; el.addEventListener('input', updateSummary); el.addEventListener('change', updateSummary); });
  [selectExisting, customChanges, filePlacementCustom].forEach(el => { if (!el) return; el.addEventListener('input', updateSummaryCustom); el.addEventListener('change', updateSummaryCustom); });
  if (uploadFileInput) uploadFileInput.addEventListener('change', updateSummary);
  if (uploadFileCustom) uploadFileCustom.addEventListener('change', updateSummaryCustom);

  // ✅ Add-to-cart (full)
  const addToCartBtn = document.getElementById('add-to-cart');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      const nameEl = document.getElementById('verify-name');
      const emailEl = document.getElementById('verify-email');
      if (!validateVerification(nameEl, emailEl)) return;
      if (!validateFullStep2()) { showStep('step2'); return; }
      updateSummary();

      hiddenFlowType.value = 'full';
      hiddenProduct.value = selectExisting.value || '';
      hiddenShape.value = selectExisting.value || '';
      hiddenText.value = textField.value.trim() || '';
      hiddenFont.value = fontSelect.value || '';
      hiddenLocation.value = textLocation.value.trim() || '';
      hiddenFilePlacement.value = filePlacementInput.value.trim() || '';
      hiddenDescription.value = additionalDesc.value.trim() || '';
      hiddenPrice.value = Number(currentPrice).toFixed(2);

      // ✅ Ensure name gets sent
      let hiddenName = document.getElementById('f-name');
      if (!hiddenName) {
        hiddenName = document.createElement('input');
        hiddenName.type = 'hidden';
        hiddenName.name = 'name';
        hiddenName.id = 'f-name';
        sendForm.appendChild(hiddenName);
      }
      hiddenName.value = nameEl.value.trim();
      hiddenEmail.value = emailEl.value.trim();

      copyFileIntoHiddenInput(uploadFileInput);

      setTimeout(() => sendForm.submit(), 0);

      window.addToCart(`Custom Engraving (${selectExisting.value || 'Custom'})`, currentPrice);
      if (typeof window.openCartPanel === 'function') window.openCartPanel();

      alert('Order added to cart and submitted.');
      showStep('step1');
    });
  }

  // ✅ Add-to-cart (custom)
  const addToCartCustomBtn = document.getElementById('add-to-cart-custom');
  if (addToCartCustomBtn) {
    addToCartCustomBtn.addEventListener('click', () => {
      const nameEl = document.getElementById('verify-name-custom');
      const emailEl = document.getElementById('verify-email-custom');
      if (!validateVerification(nameEl, emailEl)) return;
      if (!validateCustomizeStep2()) { showStep('step2_custom'); return; }
      updateSummaryCustom();

      hiddenFlowType.value = 'customize';
      hiddenSelectedProduct.value = selectExisting.value || '';
      hiddenCustomChanges.value = customChanges.value.trim() || '';
      hiddenCustomFilePlacement.value = filePlacementCustom.value.trim() || '';
      hiddenPrice.value = Number(currentPrice).toFixed(2);

      let hiddenName = document.getElementById('f-name');
      if (!hiddenName) {
        hiddenName = document.createElement('input');
        hiddenName.type = 'hidden';
        hiddenName.name = 'name';
        hiddenName.id = 'f-name';
        sendForm.appendChild(hiddenName);
      }
      hiddenName.value = nameEl.value.trim();
      hiddenEmail.value = emailEl.value.trim();

      copyFileIntoHiddenInput(uploadFileCustom);

      setTimeout(() => sendForm.submit(), 0);

      window.addToCart(`Customized: ${selectExisting.value || 'Custom Product'}`, currentPrice);
      if (typeof window.openCartPanel === 'function') window.openCartPanel();

      alert('Customized order added to cart and submitted.');
      showStep('step1');
    });
  }

  populateSelectForMode();
  updatePrice();
  showStep('step1');
});
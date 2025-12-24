// js/create.js
// ============================
// CREATE.JS — Fully fixed with separate flows for existing products and fully custom products
// ============================

document.addEventListener('DOMContentLoaded', () => {

  // ---------------------
  // State & helpers
  // ---------------------
  let currentPrice = 20;
  const $ = (sel) => document.querySelector(sel);

  function addToCartVisual(productName, price) {
    if (window.addToCart) window.addToCart(productName, price);
    else console.warn("cart.js not loaded yet");
  }

  // ---------------------
  // Elements
  // ---------------------
  const steps = Array.from(document.querySelectorAll('.step'));
  const modeCustomize = $('#mode-customize'); // customize existing
  const modeFull = $('#mode-full');           // create your own / full custom
  const selectExisting = $('#select-existing');
  const uploadFileInput = $('#upload-file');
  const uploadFileCustom = $('#upload-file-custom');
  const deleteFileBtn = $('#delete-file');
  const deleteFileCustom = $('#delete-file-custom');
  const filePlacementInput = $('#file-placement');
  const filePlacementCustom = $('#file-placement-custom');
  const textField = $('#custom-text');
  const fontSelect = $('#font-select');
  const textLocation = $('#text-location');
  const additionalDesc = $('#additional-desc');
  const customChanges = $('#custom-changes');
  const selectedProductText = $('#selected-product-text');
  const sendForm = $('#sendForm');

  // Hidden fields
  const hiddenFlowType = $('#f-flow-type');
  const hiddenProduct = $('#f-product');
  const hiddenText = $('#f-text');
  const hiddenFont = $('#f-font');
  const hiddenLocation = $('#f-location');
  const hiddenFilePlacement = $('#f-file-placement');
  const hiddenDescription = $('#f-description');
  const hiddenSelectedProduct = $('#f-selected-product');
  const hiddenCustomChanges = $('#f-custom-changes');
  const hiddenCustomFilePlacement = $('#f-custom-file-placement');
  const hiddenPrice = $('#f-price');
  const hiddenEmail = $('#f-email');

  // ---------------------
  // Separate product lists
  // ---------------------
  const existingProductPrices = {
    "Wooden Dove Plaque - Psalm 46:5": 34.99,
    "Cross Design with Bible Verse": 34.99,
    "Detailed Classic Train Engraving": 29.99,
    "“Wings Like Eagles” - Isaiah 40:31 Wooden Eagle Plaque": 34.99,
    "“Be Still” Psalm 46:10 – Wooden Sword Scripture Plaque": 24.99,
  };

  const fullCustomPrices = {
    "Wooden Plaque (Horizontal)": 39.99,
    "Wooden Plaque (Vertical)": 34.99,
    "Custom Leather Wallet": 44.99,
  };

  // ---------------------
  // Utility functions
  // ---------------------
  function showStep(stepId) {
    steps.forEach(s => s.classList.remove('active'));
    const el = document.getElementById(stepId);
    if (el) el.classList.add('active');
    window.scrollTo(0, 0);
  }

  function updatePrice() {
    if (!selectExisting) return;

    const product = selectExisting.value || '';

    // Explicit mode handling
    if (modeFull && modeFull.checked) {
      // Create your own / full custom
      currentPrice = fullCustomPrices[product] ?? 34.99;
    } else if (modeCustomize && modeCustomize.checked) {
      // Customize existing
      currentPrice = existingProductPrices[product] ?? 20.00;
    } else {
      currentPrice = 20.00; // fallback
    }

    const step3Price = $('#total-price');
    if (step3Price) step3Price.textContent = `Total: $${currentPrice}`;
    const step3CustomPrice = $('#total-price-custom');
    if (step3CustomPrice) step3CustomPrice.textContent = `Total: $${currentPrice}`;
  }

  function populateSelectForMode() {
    if (!selectExisting) return;

    let optionsHtml = '';
    if (modeFull && modeFull.checked) {
      // Create your own / full custom products
      optionsHtml = '<option value="">-- Choose a Custom Product --</option>';
      for (const productName in fullCustomPrices) {
        optionsHtml += `<option value="${productName}">${productName}</option>`;
      }
    } else if (modeCustomize && modeCustomize.checked) {
      // Existing products for customization
      optionsHtml = '<option value="">-- Select Product --</option>';
      for (const productName in existingProductPrices) {
        optionsHtml += `<option value="${productName}">${productName}</option>`;
      }
    }

    selectExisting.innerHTML = optionsHtml;
    updatePrice();
  }

  function selectProductByName(name) {
    if (!selectExisting) return;
    populateSelectForMode();
    const option = Array.from(selectExisting.options).find(o => o.value === name);
    if (option) {
      selectExisting.value = name;
      if (selectedProductText) selectedProductText.textContent = name;
      if (hiddenSelectedProduct) hiddenSelectedProduct.value = name;
      updatePrice();
    }
  }

  function copyFileIntoHiddenInput(input) {
    if (!sendForm) return;
    const fileField = sendForm.querySelector('input[type="file"]');
    if (!fileField) return;
    if (input && input.files && input.files.length > 0) {
      const dt = new DataTransfer();
      dt.items.add(input.files[0]);
      fileField.files = dt.files;
    } else {
      try { fileField.value = ''; } catch (e) {}
    }
  }

 function validateFullStep2() {
  const text = (textField && textField.value || '').trim();
  const font = (fontSelect && fontSelect.value) || '';
  const textPlacement = (textLocation && textLocation.value || '').trim();
  const desc = (additionalDesc && additionalDesc.value || '').trim();
  const hasFile = uploadFileInput && uploadFileInput.files.length > 0;
  const filePlacement = (filePlacementInput && filePlacementInput.value || '').trim();

  // Must provide at least one input
  if (!text && !desc && !hasFile) {
    alert('Enter text, upload a file, or add a description.');
    return false;
  }

  // If text is entered, font AND text placement are required
  if (text) {
    if (!font) {
      alert('Select a font for your text.');
      return false;
    }
    if (!textPlacement) {
      alert('Describe where the text should be placed.');
      return false;
    }
  }

  // If a file is uploaded, file placement is required
  if (hasFile && !filePlacement) {
    alert('Describe where the uploaded file should be placed.');
    return false;
  }

  return true;
}

  function validateCustomStep2() {
    const selected = selectExisting && selectExisting.value;
    const changes = (customChanges && customChanges.value || '').trim();
    const hasFile = uploadFileCustom && uploadFileCustom.files.length > 0;
    if (!selected) { alert('Select a product to customize.'); return false; }
    if (!changes && !hasFile) { alert('Describe changes or upload a file.'); return false; }
    return true;
  }

  function escapeHtml(str) {
    return String(str || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function populateStep3Summary() {
    const s = $('#summary');
    if (s) {
      const text = (textField && textField.value.trim()) || 'None';
      const font = (fontSelect && fontSelect.value) || 'None';
      const loc = (textLocation && textLocation.value.trim()) || 'None';
      const fileName = (uploadFileInput && uploadFileInput.files.length > 0) ? uploadFileInput.files[0].name : 'None';
      const desc = (additionalDesc && additionalDesc.value.trim()) || 'None';
      s.innerHTML = `
        <p><strong>Engraved Text:</strong> ${escapeHtml(text)}</p>
        <p><strong>Font:</strong> ${escapeHtml(font)}</p>
        <p><strong>Text Placement:</strong> ${escapeHtml(loc)}</p>
        <p><strong>Uploaded File:</strong> ${escapeHtml(fileName)}</p>
        <p><strong>Additional Description:</strong> ${escapeHtml(desc)}</p>
        <p><strong>Price:</strong> $${currentPrice}</p>
      `;
    }

    const sc = $('#summary_custom');
    if (sc) {
      const selected = selectExisting && selectExisting.value || 'None';
      const changes = (customChanges && customChanges.value.trim()) || 'None';
      const fileNameCustom = (uploadFileCustom && uploadFileCustom.files.length > 0) ? uploadFileCustom.files[0].name : 'None';
      const placementCustom = (filePlacementCustom && filePlacementCustom.value.trim()) || 'None';
      sc.innerHTML = `
        <p><strong>Selected Product:</strong> ${escapeHtml(selected)}</p>
        <p><strong>Requested Changes:</strong> ${escapeHtml(changes)}</p>
        <p><strong>Uploaded File:</strong> ${escapeHtml(fileNameCustom)}</p>
        <p><strong>File Placement:</strong> ${escapeHtml(placementCustom)}</p>
        <p><strong>Price:</strong> $${currentPrice}</p>
      `;
    }
  }

  // ---------------------
  // Step navigation click handler
  // ---------------------
  document.addEventListener('click', (ev) => {
    const btn = ev.target.closest && ev.target.closest('.next-step, .prev-step');
    if (!btn) return;
    ev.preventDefault();

    if (btn.classList.contains('next-step')) {
      if (btn.id === 'step1-next') {
        if (!selectExisting) return alert('Missing product selector.');
        if (modeCustomize && modeCustomize.checked) {
          if (!selectExisting.value) return alert('Select a product.');
          showStep('step2_custom');
        } else {
          showStep('step2');
        }
        return;
      }

      const nextId = btn.getAttribute('data-next');
      if (nextId === 'step3' && !validateFullStep2()) return;
      if (nextId === 'step3_custom' && !validateCustomStep2()) return;
      if (nextId) showStep(nextId);
      populateStep3Summary();
    }

    if (btn.classList.contains('prev-step')) {
      const prevId = btn.getAttribute('data-prev');
      if (prevId) showStep(prevId);
    }
  });

  // ---------------------
  // File delete buttons
  // ---------------------
  if (deleteFileBtn && uploadFileInput) deleteFileBtn.addEventListener('click', () => uploadFileInput.value = '');
  if (deleteFileCustom && uploadFileCustom) deleteFileCustom.addEventListener('click', () => uploadFileCustom.value = '');

  // ---------------------
  // Mode toggle listeners
  // ---------------------
  if (modeCustomize) modeCustomize.addEventListener('change', populateSelectForMode);
  if (modeFull) modeFull.addEventListener('change', populateSelectForMode);

  if (selectExisting) selectExisting.addEventListener('change', () => {
    updatePrice();
    if (selectedProductText) selectedProductText.textContent = selectExisting.value || 'None';
  });

  // ---------------------
  // Add to cart buttons
  // ---------------------
  const addToCartBtn = $('#add-to-cart');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      const name = ($('#verify-name') && $('#verify-name').value.trim()) || '';
      const email = ($('#verify-email') && $('#verify-email').value.trim()) || '';
      if (!name || !email) return alert('Enter name and email.');

      const productName = selectExisting ? selectExisting.value || 'Custom Product' : 'Custom Product';
      addToCartVisual(productName, currentPrice);

      if (hiddenFlowType) hiddenFlowType.value = 'create-your-own';
      if (hiddenProduct) hiddenProduct.value = selectExisting ? selectExisting.value : '';
      if (hiddenText) hiddenText.value = textField ? textField.value : '';
      if (hiddenFont) hiddenFont.value = fontSelect ? fontSelect.value : '';
      if (hiddenLocation) hiddenLocation.value = textLocation ? textLocation.value : '';
      if (hiddenFilePlacement) hiddenFilePlacement.value = filePlacementInput ? filePlacementInput.value : '';
      if (hiddenDescription) hiddenDescription.value = additionalDesc ? additionalDesc.value : '';
      if (hiddenPrice) hiddenPrice.value = `$${currentPrice}`;
      if (hiddenEmail) hiddenEmail.value = email;

      copyFileIntoHiddenInput(uploadFileInput);

      if (sendForm) {
        try { sendForm.submit(); } catch (e) { console.warn('Form submit failed', e); }
      }

      alert('Your custom product has been added to the Cart!');
      showStep('step1');
    });
  }

  const addToCartCustomBtn = $('#add-to-cart-custom');
  if (addToCartCustomBtn) {
    addToCartCustomBtn.addEventListener('click', () => {
      const name = ($('#verify-name-custom') && $('#verify-name-custom').value.trim()) || '';
      const email = ($('#verify-email-custom') && $('#verify-email-custom').value.trim()) || '';
      if (!name || !email) return alert('Enter name and email.');

      const productName = selectExisting ? selectExisting.value || 'Custom Product' : 'Custom Product';
      addToCartVisual(productName, currentPrice);

      if (hiddenFlowType) hiddenFlowType.value = 'customize';
      if (hiddenSelectedProduct) hiddenSelectedProduct.value = selectExisting ? selectExisting.value : '';
      if (hiddenCustomChanges) hiddenCustomChanges.value = customChanges ? customChanges.value : '';
      if (hiddenCustomFilePlacement) hiddenCustomFilePlacement.value = filePlacementCustom ? filePlacementCustom.value : '';
      if (hiddenPrice) hiddenPrice.value = `$${currentPrice}`;
      if (hiddenEmail) hiddenEmail.value = email;

      copyFileIntoHiddenInput(uploadFileCustom);

      if (sendForm) {
        try { sendForm.submit(); } catch (e) { console.warn('Form submit failed', e); }
      }

      alert('Your customization has been added to the Cart!');
      showStep('step1');
    });
  }

  // ---------------------
  // Font dropdown
  // ---------------------
  function createFontDropdown() {
    if (!fontSelect) return;
    try {
      const select = fontSelect;
      const container = document.createElement('div');
      container.classList.add('custom-select');
      select.style.display = 'none';

      const selectedDiv = document.createElement('div');
      selectedDiv.classList.add('select-selected');
      selectedDiv.textContent = select.options[select.selectedIndex]?.text || 'Choose a font';
      container.appendChild(selectedDiv);

      const optionsDiv = document.createElement('div');
      optionsDiv.classList.add('select-items', 'select-hide');

      for (let i = 0; i < select.options.length; i++) {
        const option = select.options[i];
        const optionDiv = document.createElement('div');
        optionDiv.textContent = option.text;
        optionDiv.style.fontFamily = option.value ? (option.value.includes(' ') ? `'${option.value}'` : option.value) : '';
        if (!option.value) optionDiv.style.color = '#999';

        optionDiv.addEventListener('click', function () {
          select.selectedIndex = i;
          select.value = option.value;
          select.dispatchEvent(new Event('change'));
          selectedDiv.textContent = option.text;
          selectedDiv.style.fontFamily = option.value ? optionDiv.style.fontFamily : '';
          closeAllSelect();
        });

        optionsDiv.appendChild(optionDiv);
      }

      container.appendChild(optionsDiv);
      select.parentNode.insertBefore(container, select.nextSibling);

      selectedDiv.addEventListener('click', function (e) {
        e.stopPropagation();
        closeAllSelect(this);
        optionsDiv.classList.toggle('select-hide');
        this.classList.toggle('select-arrow-active');
      });

      function closeAllSelect(except) {
        document.querySelectorAll('.select-items').forEach(el => {
          if (el.previousSibling !== except) el.classList.add('select-hide');
        });
        document.querySelectorAll('.select-selected').forEach(el => {
          if (el !== except) el.classList.remove('select-arrow-active');
        });
      }

      document.addEventListener('click', closeAllSelect);
    } catch (err) {
      console.warn('Font dropdown init failed:', err);
    }
  }
  createFontDropdown();

  if (fontSelect) {
    for (let opt of fontSelect.options) {
      if (opt.value) opt.style.fontFamily = opt.value.includes(' ') ? `'${opt.value}'` : opt.value;
    }
  }

  // ---------------------
  // Startup: handle URL params
  // ---------------------
  const urlParams = new URLSearchParams(window.location.search);
  const productParam = urlParams.get('product');
  const stepParam = urlParams.get('step');
  const modeParam = urlParams.get('mode');

  // set mode first
  if (modeParam === 'template' && modeCustomize) modeCustomize.checked = true;
  else if (modeParam === 'full' && modeFull) modeFull.checked = true;

  // then populate select
  populateSelectForMode();

  // select product if provided
  if (productParam) selectProductByName(productParam);

  // show step
  if (stepParam === '2') {
    if (modeCustomize && modeCustomize.checked) showStep('step2_custom');
    else showStep('step2');
  } else {
    showStep('step1');
  }

});
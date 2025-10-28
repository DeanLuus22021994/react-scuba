#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SPECS_DIR = path.join(__dirname, '..');
const SCHEMAS_DIR = path.join(SPECS_DIR, 'schemas');

/**
 * Basic validation for specification files
 */
function validateSpecs() {
  console.log('🔍 Validating React Scuba specifications...\n');
  
  const validations = [
    { spec: 'architecture.spec.json', schema: 'architecture.schema.json' },
    { spec: 'multi-tenant.spec.json', schema: 'multi-tenant.schema.json' },
    { spec: 'bleeding-edge.spec.json', schema: 'bleeding-edge.schema.json' }
  ];

  let allValid = true;
  
  for (const { spec, schema } of validations) {
    try {
      const specPath = path.join(SPECS_DIR, spec);
      const schemaPath = path.join(SCHEMAS_DIR, schema);
      
      if (!fs.existsSync(specPath)) {
        console.error(`❌ Specification file not found: ${spec}`);
        allValid = false;
        continue;
      }
      
      if (!fs.existsSync(schemaPath)) {
        console.error(`❌ Schema file not found: ${schema}`);
        allValid = false;
        continue;
      }
      
      // Basic JSON parsing validation
      const specData = JSON.parse(fs.readFileSync(specPath, 'utf8'));
      const schemaData = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
      
      // Basic structure validation
      const requiredFields = schemaData.required || [];
      const hasRequiredFields = requiredFields.every(field => 
        specData.hasOwnProperty(field)
      );
      
      if (hasRequiredFields) {
        console.log(`✅ ${spec} - Valid JSON structure`);
      } else {
        console.error(`❌ ${spec} - Missing required fields`);
        const missingFields = requiredFields.filter(field => 
          !specData.hasOwnProperty(field)
        );
        console.error(`   Missing: ${missingFields.join(', ')}`);
        allValid = false;
      }
      
    } catch (error) {
      console.error(`❌ Error validating ${spec}: ${error.message}`);
      allValid = false;
    }
  }
  
  console.log('\n' + '='.repeat(50));
  if (allValid) {
    console.log('🎉 All specifications are valid!');
    console.log('📋 Spec-driven development framework ready');
    process.exit(0);
  } else {
    console.error('💥 Specification validation failed!');
    process.exit(1);
  }
}

if (require.main === module) {
  validateSpecs();
}

module.exports = { validateSpecs };
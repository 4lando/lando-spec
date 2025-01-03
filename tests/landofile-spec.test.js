const Ajv = require('ajv');
const schema = require('../landofile-spec.json');
const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });

describe('Landofile Schema Validation', () => {
  const validate = ajv.compile(schema);

  test('validates a basic valid landofile', () => {
    const validLandofile = {
      name: 'myapp',
      recipe: 'lamp',
      config: {
        via: 'apache'
      }
    };
    
    const valid = validate(validLandofile);
    expect(valid).toBe(true);
  });

  test('rejects invalid app name', () => {
    const invalidLandofile = {
      name: 'INVALID_NAME!',
      recipe: 'lamp'
    };
    
    const valid = validate(invalidLandofile);
    expect(valid).toBe(false);
    expect(validate.errors).toContainEqual(
      expect.objectContaining({
        keyword: 'pattern',
        instancePath: '/name'
      })
    );
  });

  test('validates proxy configuration', () => {
    const landofileWithProxy = {
      name: 'myapp',
      recipe: 'lamp',
      proxy: {
        appserver: [
          'myapp.lndo.site',
          {
            hostname: 'custom.lndo.site',
            port: 80,
            pathname: '/api'
          }
        ]
      }
    };
    
    const valid = validate(landofileWithProxy);
    expect(valid).toBe(true);
  });

  test('rejects invalid proxy hostname pattern', () => {
    const landofileWithInvalidProxy = {
      name: 'myapp',
      recipe: 'lamp',
      proxy: {
        appserver: [
          'invalid!!hostname.lndo.site'
        ]
      }
    };
    
    const valid = validate(landofileWithInvalidProxy);
    expect(valid).toBe(false);
    expect(validate.errors).toBeTruthy();
  });
}); 
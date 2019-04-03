import { createFilter } from 'rollup-pluginutils';
import compiler from 'vue-template-compiler';
import transpileVueTemplate from 'vue-template-es2015-compiler';

function toFunction (code) {
  return ("function(){" + code + "}")
}

function string(opts) {
	if ( opts === void 0 ) opts = {};

	if (!opts.include) {
		throw Error('include option should be specified');
	}

	var templateCompilerOpts = opts.compilerOpts || {};
	
	var filter = createFilter(opts.include, opts.exclude);

	return {
		name: 'vue-template-compiler',

		transform: function transform(code, id) {
			if (filter(id)) {
				var compiled = compiler.compile(code, templateCompilerOpts);
				return {
					code: transpileVueTemplate(("module.exports={render:" + (toFunction(compiled.render)) + ",staticRenderFns:[" + (compiled.staticRenderFns.map(toFunction).join(',')) + "]}")).replace('module.exports={', 'export default {'),
					map: { mappings: '' }
				};
			}
		}
	};
}

export default string;
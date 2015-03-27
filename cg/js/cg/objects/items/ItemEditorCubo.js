
function ItemEditorCubo() {

	AItemEditorEncaixeQuadrado.call( this );

	var scope = this;

	//eventos

	//@Override
	scope.onChange = function () {}; //evento ser� executado quando um filho for adicionado ou removido ou alguma propriedade for alterada
	//@Override
	scope.onAddFilho = function ( item ) {};; //evento ser� executado quando um filho for adicionado
	//@Override
	scope.onRemoveFilho = function ( item ) {};; //evento ser� executado quando um filho for removido
	//@Override
	scope.onChangeFilhos = function ( filho ) {};; //evento ser� executado quando for removido ou inserido algum filho em um dos filhos do objeto, ou filho dos filhos e assim por diante
	//@Override
	scope.afterChangeNome = function ( nomeAntigo ) {}; //evento ser� executado quando o nome do item for alterado

	//propriedades

	scope.id =  EIdsItens.CUBO;
	scope.valorXYZ.set( 100, 100, 100 );
	scope.propriedadeCor.setHex( 0xFFFFFF );
	scope.textura = null;
	scope.usarTextura = false;
	scope.listaPontos = undefined;
	var geometria = new THREE.BoxGeometry( scope.valorXYZ.x, scope.valorXYZ.y, scope.valorXYZ.z );
	var material  = new THREE.MeshPhongMaterial({ color: scope.propriedadeCor.getHex(), ambient: scope.propriedadeCor.getHex(), overdraw: true });
	scope.object3D = new THREE.Mesh( geometria, material);
}

ItemEditorCubo.prototype = Object.create( AItemEditorEncaixeQuadrado.prototype );


function ItemEditorDrone() {
	AItemEditorEncaixeQuadrado.call( this );
	var scope = this;
	//eventos
	//@Override
	scope.onChange = function () {}; //evento será executado quando um filho for adicionado ou removido ou alguma propriedade for alterada
	//@Override
	scope.onAddFilho = function ( item ) {}; //evento será executado quando um filho for adicionado
	//@Override
	scope.onRemoveFilho = function ( item ) {}; //evento será executado quando um filho for removido
	//@Override
	scope.onChangeFilhos = function ( filho ) {}; //evento será executado quando for removido ou inserido algum filho em um dos filhos do objeto, ou filho dos filhos e assim por diante
	//@Override
	scope.afterChangeNome = function ( nomeAntigo ) {}; //evento será executado quando o nome do item for alterado
	//propriedades
	scope.valorXYZ = undefined;
	scope.id =  EIdsItens.DRONE;
	scope.propriedadeCor = undefined;
	scope.object3D = undefined;
	createObject3D(); //load the obj file;

	function createObject3D() {
		if( scope.object3D == undefined ){
			CG.OBJLoader.load("resources/Drone_1.obj",
				function ( model ) {
					console.log("Modelo 3D carregado com sucesso");
					scope.object3D = model;
					scope.object3D.item = scope;
				},
				function( progress ){
					console.log("Carregando modelo 3D...");
				},
				function( error ){
					console.error("Erro ao carregar modelo 3D");
				});
		}
	}
}
ItemEditorDrone.prototype = Object.create( AItemEditorEncaixeQuadrado.prototype );

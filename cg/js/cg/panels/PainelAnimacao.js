/**
 * Painel que controla as animações. Com ele eh possivel iniciar e visualizar os valores
 * durante as animações.
 */
function PainelAnimacao( editor ) {

	UI.Panel.call( this );
	/**Objeto responsavel por controlar o drone utilizando o ROS*/
	var ros = new ROSHandler();

	this.setClass( 'painel' );
	this.dom.id = 'painelAnimacao';
	this.setPosition( 'absolute' );
	this.setDisplay( 'broke' );

	if ( !(editor instanceof Editor) ) {
		throw new Error ( 'argumento deve ser da classe Editor !' );
	}
	var editor = editor;
	//campos utilizados no painel
	var positionX = new UI.Text('-').setColor('#666');
	var positionY = new UI.Text('-').setColor('#666');
	var positionZ = new UI.Text('-').setColor('#666');
	var rotationX = new UI.Text('-').setColor('#666');
	var rotationY = new UI.Text('-').setColor('#666');
	var rotationZ = new UI.Text('-').setColor('#666');
	var time = new UI.Number().setWidth('50px');
	var distanceAverage = new UI.Number().setWidth('50px').setValue(1);
	time.setValue(2000);
	//adiciona os campos para exibiram os valores do posicionamento do objeto
	var linhaValues = new UI.Panel();
	linhaValues.add(new UI.Text('Posição').setColor('#666'));
	this.add(linhaValues);
	linhaValues = new UI.Panel();
	linhaValues.add(new UI.Text('X: ').setColor('#666'));
	linhaValues.add(positionX);
	this.add(linhaValues);
	linhaValues = new UI.Panel();
	linhaValues.add(new UI.Text('Y: ').setColor('#666'));
	linhaValues.add(positionY);
	this.add(linhaValues);
	linhaValues = new UI.Panel();
	linhaValues.add(new UI.Text('Z: ').setColor('#666'));
	linhaValues.add(positionZ);
	this.add(linhaValues);
	//adiciona os campos para exibiram os valores de rotação do objeto
	linhaValues = new UI.Panel();
	linhaValues.add(new UI.Text('Rotação').setColor('#666'));
	this.add(linhaValues);
	linhaValues = new UI.Panel();
	linhaValues.add(new UI.Text('X: ').setColor('#666'));
	linhaValues.add(rotationX);
	this.add(linhaValues);
	linhaValues = new UI.Panel();
	linhaValues.add(new UI.Text('Y: ').setColor('#666'));
	linhaValues.add(rotationY);
	this.add(linhaValues);
	linhaValues = new UI.Panel();
	linhaValues.add(new UI.Text('Z: ').setColor('#666'));
	linhaValues.add(rotationZ);
	this.add(linhaValues);
	linhaValues = new UI.Panel();
	linhaValues.add(new UI.Text('Time: ').setColor('#666'));
	linhaValues.add(time);
	this.add(linhaValues);
	linhaValues = new UI.Panel();
	//botão que inicia as animações
	var playButton = new UI.Button();
	playButton.setLabel('Play!');
	var scope = this;
	playButton.onClick( startAnimations );
	linhaValues.add(playButton);
	this.add(linhaValues);
	this.add(new UI.Break());
	linhaValues = new UI.Panel();
	linhaValues.add(new UI.Text('Configurações ROS').setColor('#666'));
	this.add(linhaValues);
	this.add(new UI.Break());
	linhaValues = new UI.Panel();
	linhaValues.add(new UI.Text('ROS Server: ').setColor('#666'));
	var ros_server = new UI.Input().setWidth( '150px' ).setColor( '#444' ).setFontSize( '12px' ).setValue('localhost:9090');
	linhaValues.add(ros_server);
	var connectButton = new UI.Button();
	connectButton.setLabel('Connect');
	connectButton.onClick( function () {
		ros.connect(ros_server.getValue());
	});
	linhaValues.add(connectButton);
	this.add(linhaValues);
	linhaValues = new UI.Panel();
	linhaValues.add(new UI.Text('Média distância (m/s): ').setColor('#666'));
	linhaValues.add(distanceAverage);
	this.add(linhaValues);
	/**Animações correntes que estão/vão sendo executadas*/
	var currentAnimatios = [];
	/**Index de currentAnimatios que está atualmente em execução*/
	var currentAnimation = 0;
	var object3D = undefined;

	/**
	 * Método que vai percorrer todos os itens de objetos gráficos existentes
	 * e vai iniciar as animações
	 */
	function startAnimations() {
		var item = editor.painelMontagem;
		if (item.filhos.length > 0){
			//percorre os filhos procurando um objeto grafico que tenha animação
			for (var i = 0; i < item.filhos.length; i++) {
				var filho = item.filhos[i];
				if( filho.id == EIdsItens.OBJETOGRAFICO && filho.isAnimated ){
					//encontrou um filho animado \o/
					var animationChain = []
					var easing = undefined;
					var obj3DIndex = undefined;
					if( filho === editor.getItemSelecionado() ){
						currentAnimation = 0;
						currentAnimatios = [];
						object3D = undefined;
					}
					//pega a função de interpolação da animação para esse filho
					for( var q = 0; q < filho.filhos.length; q++ ){
						if( filho.filhos[q].id == EIdsItens.ANIMACAO ){
							easing = filho.filhos[q].easing;
							break;
						}
						if( filho.filhos[q].tipoEncaixe == ETiposEncaixe.QUADRADO ){
							if( filho === editor.getItemSelecionado() ){
								object3D = filho.filhos[q].object3D;
							}
							obj3DIndex = q;
						}
					}
					//pega todas as animações para esse filho
					for( var q = 0; q < filho.filhos.length; q++ ){
						var animation = null;
						if( filho.filhos[q].tipoEncaixe == ETiposEncaixe.DIAMANTE ){
							var animationItem = filho.filhos[q];
							if (filho === editor.getItemSelecionado()){
								currentAnimatios.push(animationItem);
							}
							if( animationItem.id == EIdsItens.TRANSLADAR ){
								animation = new TWEEN.Tween(filho.filhos[obj3DIndex].object3D.position)
								.to({x: (animationItem.valorXYZ.x >= 0 ? "+" : "-") + Math.abs(animationItem.valorXYZ.x),
								    y: (animationItem.valorXYZ.y >= 0 ? "+" : "-") + Math.abs(animationItem.valorXYZ.y),
								    z: (animationItem.valorXYZ.z >= 0 ? "+" : "-") + Math.abs(animationItem.valorXYZ.z)}, time.getValue())
								.easing(CG.getEasingFunction(easing))
								if( filho === editor.getItemSelecionado() ){
									animation.onStart(onStartAnimation)
										.onStop(onFinishAnimation)
										.onComplete(onFinishAnimation)
										.onUpdate(updateValues);
								}
							} else if( animationItem.id == EIdsItens.ROTACIONAR ){
								animation = new TWEEN.Tween(filho.filhos[obj3DIndex].object3D.rotation)
								.to({x: (animationItem.valorXYZ.x >= 0 ? "+" : "-") + Util.math.converteGrausParaRadianos(Math.abs(animationItem.valorXYZ.x)),
								    y: (animationItem.valorXYZ.y >= 0 ? "+" : "-") + Util.math.converteGrausParaRadianos(Math.abs(animationItem.valorXYZ.y)),
								    z: (animationItem.valorXYZ.z >= 0 ? "+" : "-") + Util.math.converteGrausParaRadianos(Math.abs(animationItem.valorXYZ.z))}, time.getValue())
								.easing(CG.getEasingFunction(easing));
								if( filho === editor.getItemSelecionado() ){
									animation.onStart(onStartAnimation)
										.onStop(onFinishAnimation)
										.onComplete(onFinishAnimation)
										.onUpdate(updateValues);
								}
							}
							animationChain.push(animation);
						}
					}
					//monta o chain com todas as animações para esse obj gráfico
					for( var ai = animationChain.length-1; ai > 0; ai-- ){
						animationChain[ai-1].chain(animationChain[ai]);
					}
					//iniciar!
					if( animationChain[0] != undefined ){
						if( filho === editor.getItemSelecionado() ){
							animationChain[0].onStart( function() {
								onStartAnimation();
								onStartAnimationChain();
							});
							animationChain[animationChain.length-1].onStop( function() {
								onFinishAnimation();
								onFinishAnimationChain();

							});
							animationChain[animationChain.length-1].onComplete( function() {
								onFinishAnimation();
								onFinishAnimationChain();
							});
						} else {
							animationChain[animationChain.length-1].onStop(onFinishAnimationChain);
							animationChain[animationChain.length-1].onComplete(onFinishAnimationChain);
						}
						animationChain[0].start();
					}
				}//if
			}//for
		}
	}

	/**
	 * Função para atualizar os valores do object3D durante a animação
	 */
	function updateValues() {
		//var object3D = editor.getItemSelecionado().object3D;
		positionX.setValue(object3D.position.x);
		positionY.setValue(object3D.position.y);
		positionZ.setValue(object3D.position.z);
		rotationX.setValue(Util.math.converteRadianosParaGraus(object3D.rotation.x));
		rotationY.setValue(Util.math.converteRadianosParaGraus(object3D.rotation.y));
		rotationZ.setValue(Util.math.converteRadianosParaGraus(object3D.rotation.z));
	}

	/**
	 * Função volta para a cor default do item no editor
	 */
	function onFinishAnimation(){
		currentAnimatios[currentAnimation].setMeshsColor( CG.colors.corPecasDiamante );
		currentAnimation++;
	}

	/**
	 * Função muda a cor do item de animação no editor para indicar a execução do mesmo
	 */
	function onStartAnimation(){
		currentAnimatios[currentAnimation].setMeshsColor( CG.colors.corCurrentAnimation );
	}

	/**
	 * Função executada no inicio do animation chain
	 */
	function onStartAnimationChain(){
		playButton.setEnable(false);
	}

	/**
	 * Função executada no final do animation chain
	 */
	function onFinishAnimationChain(){
		playButton.setEnable(true);
	}

}

PainelAnimacao.prototype = Object.create( UI.Panel.prototype );

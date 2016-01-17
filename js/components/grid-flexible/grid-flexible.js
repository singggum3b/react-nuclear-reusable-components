//===============================================
var boxpack = require("boxpack");
//===============================================

var Grid = React.createClass({
	displayName: "GridF",
	propTypes: {
		config: React.PropTypes.shape({}),
		getTransitionWrapper: React.PropTypes.func,
		fillGap: React.PropTypes.func,
		meta: React.PropTypes.object
	},
	statics: {
		/**
		 * @props CSSTransitionGroup props objects to override,except component attribute
		 */
		getTransitionWrapper(props) {
			var _defaultWrapper = <ReactCSSTransitionGroup component="div" transitionName="grid-animation"
																										 transitionAppear={false}
																										 transitionEnter={false} transitionLeave={false}/>;
			return props ? React.cloneElement(_defaultWrapper, props) : _defaultWrapper;
		}
	},
	getDefaultProps() {
		return {
			getTransitionWrapper: ()=> {
				return Grid.getTransitionWrapper();
			}
		}
	},
	getInitialState() {
		return {
			containerWidth: 0,
			containerHeight: 0,
			itemPropertyList: [],
			fillerArray: [],
			itemPropsMap: null
		}
	},
	componentDidMount() {
		var newState = this.processGrid(this.props);
		this.setState(Object.assign(newState,{
			containerWidth: this._grid.offsetWidth
		}));
	},
	componentWillReceiveProps(nextProps) {
		var newState = this.processGrid(nextProps);
		//====================================
		if (nextProps.fillGap && newState.fillerArray.length) {
			nextProps.fillGap && nextProps.fillGap(newState.fillerArray, newState.itemPropertyList.length, nextProps.meta);
			newState.itemPropertyList = [];
			newState.fillerArray = [];
		}
		this.setState(newState);
	},
	componentDidUpdate(prevProps, prevState) {
		var newState = {};
		//Update if childs has changed dimension
		if (this.state.itemPropsMap) {
			newState =  this.processGrid(this.props);
		}
		//====================================
		if (this._grid) {
			var el = this._grid;
			if (Math.abs(el.offsetWidth - this.state.containerWidth) > 1) {
				newState.containerWidth = el.offsetWidth;
				//console.log(el.offsetWidth);
			}
			//====================================
			var containerHeight = this.getContainerHeight(this.state.itemPropertyList, el.offsetWidth, this.props);
			if ((Math.abs(containerHeight - this.state.containerHeight) > 1) && containerHeight != 0) {
				newState.containerHeight = containerHeight
			}

			if (Object.keys(newState).length !== 0) this.setState(newState);
		}
	},
	getContainerHeight(itemPropertyList, containerWidth, props) {
		var _containerWidth = containerWidth ? containerWidth : this.state.containerWidth;
		var _props = props ? props : this.props;
		return itemPropertyList.reduce(function (lastReturned, item) {
			var pivot = item.y + item.height;
			//console.log(pivot);
			if ((pivot) > lastReturned) {
				return pivot;
			} else return lastReturned;
		}, 0);
	},
	updateChildProps(childID,props){
		//console.log(childID,props);
		!this._tempItemPropsMap && (this._tempItemPropsMap = new Map());
		this._tempItemPropsMap.set(childID, props);
		if (this._tempItemPropsMap.size == React.Children.count(this.props.children)) {
			//console.log(props.containerWidth,this.state.containerWidth);
			this.setState({
				itemPropsMap: this._tempItemPropsMap
			});
			this._tempItemPropsMap = new Map();
		}
	},
	processGrid(props) {

		//get the dimension array
		var itemPropertyList = [];
		React.Children.forEach(props.children, (child)=> {
			this.state.itemPropsMap && itemPropertyList.push(this.state.itemPropsMap.get(child.props.config.id));
		});

		//Fit in the layout
		//console.log(itemPropertyList);
		this._bin = boxpack({
			width: itemPropertyList[0] ? itemPropertyList[0].containerWidth : this.state.containerWidth,
			algo: boxpack.algo.top
		});

		//console.log(this._grid.offsetWidth);
		itemPropertyList = this._bin.pack(itemPropertyList);
		//console.log(this._grid.offsetWidth,itemPropertyList);

		//Check for empty gap
		var fillerArray = [];
		for (var i = 0; i < this._bin._empty.length; i++) {
			var gap = this._bin._empty[i];
			if (isFinite(gap.width) && isFinite(gap.height)) {
				//console.log(this._bin._empty);
				//console.log(itemPropertyList);
				fillerArray.push(Object.assign({}, gap));
				//console.log(itemPropertyList);
				//console.log(fillerArray);
			}
		}

		//Get the height of bin
		var containerHeight = this.getContainerHeight(itemPropertyList, null, props);

		return  {
			containerHeight: containerHeight,
			itemPropertyList: itemPropertyList,
			fillerArray: fillerArray,
			itemPropsMap : null,
			containerWidth: this._grid.offsetWidth
		};
	},
	processItem(childItems) {

		//Return processed items
		return React.Children.map(childItems, (child, index) => {
			if (child.type == Grid.Item) {
				//console.log(this.state.itemPropertyList[index]);

				return React.cloneElement(child, Object.assign({
					updateProps: this.updateChildProps,
					containerHeight: this.state.containerHeight,
					containerWidth: this.state.containerWidth
				}, this.state.itemPropertyList[index]));
			}
		});

	},
	gridRefs(dom) {
		if (dom) {
			this._grid = ReactDOM.findDOMNode(dom);
		}
	},
	buildGrid(props, state) {

		let _className = cx({
			"b-grid-flexible": true
		});

		let _style = {
			height: state.containerHeight,
			position: "relative"
		};

		return React.cloneElement(props.getTransitionWrapper(), {
			children: this.processItem(props.children),
			ref: this.gridRefs,
			className: _className,
			style: _style
		});
	},
	render() {
		return this.buildGrid(this.props, this.state);
	}
});

Grid.Item = React.createClass({
	displayName: "GridF.Item",
	propTypes: {
		//User only provide config object
		config: React.PropTypes.shape({
			id: React.PropTypes.oneOfType([React.PropTypes.number,React.PropTypes.string]).isRequired,
			width: React.PropTypes.number.isRequired,
			widthType: React.PropTypes.oneOf(["px", "%"]).isRequired
		}).isRequired,
		//Internal use
		updateProps: React.PropTypes.func,
		containerWidth: React.PropTypes.number,
		x: React.PropTypes.number,
		y: React.PropTypes.number,
		width: React.PropTypes.number,
		height: React.PropTypes.number,
		children: React.PropTypes.node
	},
	componentDidMount() {
		this._dom && this.props.updateProps(this.props.config.id,{containerWidth: this.props.containerWidth ,height: this._dom.offsetHeight,width: this.getItemWidth(this.props)});
	},
	componentDidUpdate(prevProps,prevState) {
		if (((prevProps.containerWidth !== this.props.containerWidth) && this.props.containerWidth) || isNaN(this.props.x)) {
			//console.log(this.props.containerWidth,this.getItemWidth(this.props));
			this._dom && this.props.updateProps(this.props.config.id,{containerWidth: this.props.containerWidth ,height: this._dom.offsetHeight,width: this.getItemWidth(this.props)});
		}
	},
	itemRef(dom) {
		if (dom) {
			this._dom = dom;
		}
	},
	getItemWidth(props) {
		return mdx(props.config.widthType, {
			"px": ()=> {
				return props.config.width + "px";
			},
			"%": ()=> {
				return props.config.width * props.containerWidth;
			}
		});
	},
	buildItem(props, state) {
		let itemWidth = this.getItemWidth(props);

		var _itemStyle = (!isNaN(props.x)) ? {
			left: props.x,
			top: props.y,
			width: props.width,
			height: props.height,
			position: "absolute"
		} : {
			top: 0,
			left: 0,
			width: itemWidth,
			position: "absolute",
			visibility: "hidden",
			pointerEvents: "none"
		};

		return (
				<div ref={this.itemRef} style={_itemStyle} className="item">
					{this.props.children}
				</div>
		);
	},
	render() {
		return this.buildItem(this.props, this.state);
	}

});

module.exports = Grid;

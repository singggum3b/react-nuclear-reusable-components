let Grid = require("client/js/components/grid-flexible");


var IntroLogo = React.createClass({
	displayName: "IntroLogo",
	buildIntroLogo(props, state) {
		return (
				<Grid>
					<Grid.Item key={1} config={{id: 1, width: 1/3,widthType:"%"}} className="item">
						<p>
							let-scoped variables in for loops
							<br/>
							<br/>
							<br/>
							You can use the let keyword to bind variables locally in the scope of for loops. This is different from the var keyword in the head of a for loop, which makes the variables visible in the whole function containing the loop.
						</p>
					</Grid.Item>
					<Grid.Item key={2} config={{id: 2,width: 1/3,widthType:"%"}} className="item">
						<p>
							let-scoped variables in for loops
							<br/>
							You can use the let keyword to bind variables locally in the scope of for loops. This is different from the var keyword in the head of a for loop, which makes the variables visible in the whole function containing the loop.
						</p>
					</Grid.Item>
					<Grid.Item key={3} config={{id: 3,width: 1/3,widthType:"%"}}  className="item">
						<p>
							let-scoped variables in for loops
							<br/>
							<br/>
							You can use the let keyword to bind variables locally in the scope of for loops. This is different from the var keyword in the head of a for loop, which makes the variables visible in the whole function containing the loop.
						</p>
					</Grid.Item>
					<Grid.Item key={4} config={{id: 4,width: 1/2,widthType:"%"}}  className="item">
						<p>
							let-scoped variables in for loops
							You can use the let keyword to bind variables locally in the scope of for loops. This is different from the var keyword in the head of a for loop, which makes the variables visible in the whole function containing the loop.
						</p>
					</Grid.Item>
					<Grid.Item key={5} config={{id: 5, width: 1/3,widthType:"%"}} className="item">
						<p>
							let-scoped variables in for loops
							<br/>
							<br/>
							<br/>
							You can use the let keyword to bind variables locally in the scope of for loops. This is different from the var keyword in the head of a for loop, which makes the variables visible in the whole function containing the loop.
						</p>
					</Grid.Item>
					<Grid.Item key={6} config={{id: 6,width: 1/4,widthType:"%"}} className="item">
						<p>
							let-scoped variables in for loops
							<br/>
							You can use the let keyword to bind variables locally in the scope of for loops. This is different from the var keyword in the head of a for loop, which makes the variables visible in the whole function containing the loop.
						</p>
					</Grid.Item>
					<Grid.Item key={7} config={{id: 7,width: 1/4,widthType:"%"}}  className="item">
						<p>
							let-scoped variables in for loops
							<br/>
							<br/>
							You can use the let keyword to bind variables locally in the scope of for loops. This is different from the var keyword in the head of a for loop, which makes the variables visible in the whole function containing the loop.
						</p>
					</Grid.Item>
					<Grid.Item key={8} config={{id: 8,width: 1/2,widthType:"%"}}  className="item">
						<p>
							let-scoped variables in for loops
							You can use the let keyword to bind variables locally in the scope of for loops. This is different from the var keyword in the head of a for loop, which makes the variables visible in the whole function containing the loop.
						</p>
					</Grid.Item>
				</Grid>
		)
	},
	render() {
		return this.buildIntroLogo(this.props, this.state);
	}
});

module.exports = IntroLogo;

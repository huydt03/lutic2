let tooltip = {
	to: '',
	target: document.getElementById('tooltip'),
	show: function(id){
		tooltip.target.style.display = 'none';
		setTimeout(function(){
			tooltip.target.style.display = 'block';
		}, 20);
		tooltip.target.innerHTML = `Vui lòng mở quà! ${id}`;
		clearTimeout(tooltip.to);
		tooltip.to = setTimeout(function(){
			tooltip.target.style.display = 'none';
		} ,1000)
	}
}

function Options(onApply = new Function){

	function Item(num, item_options = [], onRemove = new Function){
		let target = document.createElement('div');
		target.classList = "option-item";
		let target_container = document.createElement('div');
		target_container.classList = "item-container";
		let target_num = document.createElement('input');
		target_num.type = 'number';
		let target_remove = document.createElement('label');
		let target_select_image = document.createElement('img');
		let {target_select, updateOptions} = new ItemImg;

		let self = {target, data, remove, updateOptions, setSelected};

		function setSelected(value){
			let v = value;
			let img = item_options[v];
			target_select.value = v;
			target_select_image.src = img;
		}

		function ItemImg(){
			let target_select = document.createElement('select');
			target_select.onchange = function(e){
				setSelected(e.target.value);
			}

			function updateOptions(imgs = []){
				target_select.innerHTML = '';
				item_options = imgs;

				for(let i in imgs){
					let target_option = document.createElement('option');
					target_option.value = i;
					target_option.innerHTML = i;
					target_select.appendChild(target_option);
				}
			}

			function init(){
				updateOptions(item_options);
			}init();

			return {target_select, updateOptions};
		}

		function remove(){
			target.remove();
			onRemove(self);
		}

		function data(){
			return [
				target_num.value,
				target_select.value
			];
		}

		function init(){

			target_num.value = num || 1;
			target_remove.innerHTML = 'x';
			target_remove.onclick = remove;

			target_container.append(target_num, target_select)
			target.append(target_container, target_remove, target_select_image);
		}init();

		return self;

	}

	const KEY = 'data';

	const DEFAULT = [["5","10k"],["5","20k"],["5","50k"],["5","100k"],["5","200k"],["5","500k"]];

	let items = [];
	let item_options = [];
	let stoge_data = JSON.parse(localStorage.getItem(KEY, []));
	stoge_data = stoge_data || DEFAULT;

	let target = document.createElement('div');
	target.classList = "app-options";
	let target_methods = document.createElement('div');
	target_methods.classList = "app-methods";
	let target_items = document.createElement('div');
	target_items.classList = "app-items";
	let target_plus = document.createElement('div');
	let target_clear = document.createElement('div');
	let target_reset = document.createElement('div');
	let target_default = document.createElement('div');
	let target_apply = document.createElement('div');

	let self = {target, data, item_options};

	function add(value = '', selected){
		let item = new Item(value, item_options, remove);
		items.push(item);
		target_items.append(item.target);
		item.setSelected(selected || Object.keys(item_options)[0]);
	}

	function apply(){
		let d = data();
		// d = d.length? d: DEFAULT;
		stoge_data = d;
		localStorage.setItem(KEY, JSON.stringify(d));
		onApply(d);
		alert('Apply success!');
	}

	function clear(){
		for(let i in items){
			items[i].target.remove();
			delete items[i];
		}
		onApply();
	}

	function reset(){
		clear();
		self.item_options = item_options;
	}

	function _default(){
		clear();
		for(let i in DEFAULT){
			let data = DEFAULT[i];
			add(data[0], data[1]);
		}
		onApply(DEFAULT)
	}

	function remove(item){
		let index = items.indexOf(item);
		if(index > -1)
			items.splice(index, 1);
	}

	function data(){
		let items_data = [];

		for(let i in items){
			let item = items[i];
			let item_data = item.data();
			items_data.push(item_data);
		}

		return items_data;
	}

	function init(){

		target_plus.innerHTML = '+';
		target_plus.onclick = function(){
			add();
		};
		target_clear.innerHTML = 'Clear';
		target_clear.onclick = clear;
		target_reset.innerHTML = 'Reset';
		target_reset.onclick = reset;
		target_default.innerHTML = 'Default';
		target_default.onclick = _default;
		target_apply.innerHTML = 'Apply';
		target_apply.onclick = apply;

		target_methods.append(target_plus, target_clear, target_reset, target_default, target_apply);
		target.append(target_methods);
		target.append(target_items);

		Object.defineProperties(self, {
			item_options: {
				set: function(value){
					item_options = value;
					for(let i in items){
						items[i].updateOptions(item_options);
					}
					for(let i in stoge_data){
						let data = stoge_data[i];
						add(data[0], data[1]);
					}
					onApply(stoge_data)
				}
			}
		});

	}init();

	return self;

}

function Game(){

	let target = document.createElement('div');
	target.classList = 'game-panel';
	let target_result = document.createElement('div');
	target_result.classList = 'game-results';
	let target_tick = document.createElement('div');
	target_tick.classList = 'game-ticks';
	target.append(target_result, target_tick);

	let data = {};

	let _item_target;
	let _target;
	let item_target_selected;
	let c_timeout;
	let _num;

	function TickItem(num, item_target, amount){
		let target = document.createElement('div');
		target.classList = 'game-tick';
		target.innerHTML = '?';

		target.onclick = function(){
			if(item_target_selected){
				tooltip.show(_num);
				return;
			}
			_num = num;
			if(_target)
				_target.style.color = 'unset';
			_target = target;
			target.onclick = '';
			target.innerHTML = num;
			target.style.color = 'red';
			target.style.background = 'none';
			if(item_target){
				item_target.onclick = function(){
					item_target.onclick = '';
					item_target_selected = null;
					item_target.style.backgroundImage = `url(assets/imgs/${amount}.png)`;				
					_item_target = item_target.cloneNode(true);
					_item_target.innerHTML = '';
					_item_target.classList.remove('game-item');
					_item_target.classList.add('animate');
					target_result.append(_item_target);
					clearTimeout(c_timeout);
					c_timeout = setTimeout(function(){
						_item_target.remove();
					}, 2000)
				}
				if(item_target_selected)
					item_target_selected.style.color = '';
				item_target_selected = item_target;
				item_target_selected.style.color = '#fff';
			}
		}

		return target;
	}

	function Item(amount){

		function randNum(){
			let num = Math.round(Math.random()*999);
			if(!data[num])
				return num;
			return randNum();
		}

		let id = randNum();

		let target = document.createElement('div');
		target.classList = 'game-item';
		target.style.backgroundImage = `url(assets/imgs/qcwe.png)`;
		let target_num = document.createElement('label');
		target_num.innerHTML = id;

		target.append(target_num);

		let target_tick = new TickItem(id, target, amount);

		return {id, target, target_tick};
	}

	function clear(){
		data = {};
		target_result.innerHTML = '';
		target_tick.innerHTML = '';
	}

	function update(e, n_tick_fail = 0){

		clear();

		for(let i in e){
			let value = e[i];
			let qualty = parseInt(value[0]);
			let amount = value[1];
			for(let j = 0; j < qualty; j++){
				let item = new Item(amount);
				let {id, target, target_tick} = item;
				data[id] = {target, target_tick};
			}
		}

		let keys = Object.keys(data);

		let max = keys.length - 1;

		for(let i = 0; i <= max; i++){
			let _max = max - i;
			let n_rand = Math.round(Math.random()*_max);
			let index = keys[i + n_rand];
			target_result.append(data[index].target);
			keys[i + n_rand] = keys[i];
		}

		let _keys = Object.keys(data);
		max += n_tick_fail;

		for(let i = 0; i <= max; i++){
			let _max = max - i;
			let n_rand = Math.round(Math.random()*_max);
			let index = _keys[i + n_rand];
			target_tick.append(data[index].target_tick);
			_keys[i + n_rand] = _keys[i];
		}

	}

	return {update, target};

}

let game = new Game;

let options = new Options(game.update);

options.item_options = {
	'10k': 'assets/imgs/10k.png',
	'20k': 'assets/imgs/20k.png',
	'50k': 'assets/imgs/50k.png',
	'100k': 'assets/imgs/100k.png',
	'200k': 'assets/imgs/200k.png',
	'500k': 'assets/imgs/500k.png',
};

document.getElementById('options').append(options.target)
document.getElementById('game').append(game.target)

function BinarySearchTree(){
	this._root = null;
}
BinarySearchTree.prototype= {
	// restore constructor
	constructor:BinarySearchTree,
	add:function(value){
		//create a new item object, place data in
		var node={
				value:125,
				left:null,
				right:null
			},
			current;
			if(this._root === null){
				this._root = node;
			}else {
				current = this._root;
				while(true){
					if(value < current.value){
						if (current.left === null) {
							   current.left = node;
							   break;
						}else{
                               current = current.left;
					       }
					}else if(value > current.value){
						
						if(current.right === null){
                            current.right = node;
                            break;
						}else{
							current = current.right;
						}
						//if the new value is equal to the current one, just ignore
					}else{
						break;
					}
				}
			}
	},
	contains:function(value){
		//查找是否存在
        var found  = false,
            current  = this._root
        //make sure there's a node to search
        while(!found && current){
        	if(value < current.value){
        		current = current.left;
        	}else if(value > current.value){
        		current = current.right;
        	}else{
        		found = true;
        	}
        }
        //only proceed if the node was found
        return found;
	},

	remove:function(value){

	},
	size:function(){
           var length = 0;

        this.traverse(function(node){
            length++;
        });

        return length;
	},
	toArray:function(){
        var result = [];

        this.traverse(function(node){
            result.push(node.value);
        });

        return result;
	},
	toString:function(){
          return this.toArray().toString();
    
	},
	traverse:function(){
		function inOrder(node){
			if(node){
				 //traverse the left subtree
				if(node.left! == null){
					inOrder(node.left);
				}
				//call the process method on this node
				process.call(this,node);
				//traverse the right subtree
				if(node.right !==null){
					inOrder(node.right);
				}
			}
		}
		 //start with the root
		inOrder(this._root);
	}
};

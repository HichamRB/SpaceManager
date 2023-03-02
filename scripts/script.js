const generate1Btn = document.querySelector('#generate1');
const generate2Btn = document.querySelector('#generate2');
const box1 = document.querySelector('#box1');
const box2 = document.querySelector('#box2');






generate1Btn.addEventListener('click', generateDiv1);
generate2Btn.addEventListener('click', generateDiv2);




function generateDiv2() {
    const width = document.querySelector('#width').value;
    const height = document.querySelector('#height').value;

    const div2 = document.createElement('div');
    div2.setAttribute('id', "div2Id");
    div2.style.width = width * 100 +0.2 + 'px';
    div2.style.height = height * 100 + 'px';
    div2.style.background = 'grey';

    box2.appendChild(div2);
    const div2Id = document.querySelector('#div2Id');
}


function generateDiv1() {
    const width = document.querySelector('#width').value;
    const height = document.querySelector('#height').value;
    const moveAllBtn = document.querySelector('#moveAllBtn');
    moveAllBtn.addEventListener('click', moveAllDivs);

    const div1 = document.createElement('div');
    div1.style.width = width * 100 + 'px';
    div1.style.height = height * 100 + 'px';
    div1.style.boxSizing= 'border-box';
    div1.style.border= '2px solid black';
    div1.style.margin = '1px';
    div1.style.cursor = 'move';
    div1.style.background = '#f00';
    div1.style.fontSize = '10px';
    div1.innerHTML = `L: ${width}m <br> H: ${height}m`;
    div1.style.position = 'absolute';

    // Calculate the vertical position of the new div by adding the height of the previous div
    if (box1.lastChild){
        const previousDiv = box1.lastChild;
        const previousBottom = previousDiv ? previousDiv.offsetTop + previousDiv.offsetHeight : 0;
        div1.style.top = previousBottom + 'px';
    }

    box1.appendChild(div1);

    let div1_x = 0;
    let div1_y = 0;

    div1.addEventListener('mousedown', startDragging);
    div1.addEventListener('mouseup', stopDragging);

    function startDragging(event) {
        event.preventDefault();
        div1_x = event.clientX - div1.offsetLeft;
        div1_y = event.clientY - div1.offsetTop;
        document.addEventListener('mousemove', moveInterface);
    }

    function stopDragging(event) {
        document.removeEventListener('mousemove', moveInterface);
        checkOverlap();
    }

    function moveInterface(event) {
        const x = event.clientX - div1_x;
        const y = event.clientY - div1_y;
        div1.style.left = x + 'px';
        div1.style.top = y + 'px';
        checkOverlap();

    }

    function checkOverlap() {
        const div1Rect = div1.getBoundingClientRect();
        const div2Rect = div2Id.getBoundingClientRect();


        let isOverlap = false;
        // check overlap with other div1 elements
        box1.childNodes.forEach(childNode => {
            if (childNode === div1) {
                return; // skip comparing with itself
            }
            const childRect = childNode.getBoundingClientRect();
            if (
                div1Rect.top < childRect.bottom &&
                div1Rect.bottom > childRect.top &&
                div1Rect.right > childRect.left &&
                div1Rect.left < childRect.right
            ) {
                isOverlap = true;
            }
        });

        // Check for overlap

        if (isOverlap) {
            div1.style.background = '#ffff00';
        } else {
            if (
                div1Rect.top >= div2Rect.top &&
                div1Rect.bottom <= div2Rect.bottom &&
                div1Rect.left >= div2Rect.left &&
                div1Rect.right <= div2Rect.right
            ) {
                div1.style.background = '#0f0';
            } else {
                div1.style.background = '#f00';
            }
        }
    }

    function moveAllDivs() {
        const div1s = document.querySelectorAll('#box1 > div');
        const div2 = document.querySelector('#div2Id');

        // Use a binary tree to find the best position for each div in div2
        const rootNode = new BinaryTreeNode({
            top: 0,
            left: 0,
            right: div2.offsetWidth,
            bottom: div2.offsetHeight
        });

        // Calculate the best position for each div in div2
        const positions = [];
        div1s.forEach(div1 => {
            const div1Rect = div1.getBoundingClientRect();
            const position = rootNode.insert(div1Rect.width, div1Rect.height);
            positions.push(position);
        });

        // Move each div to its best position in div2
        positions.forEach((position, i) => {
            const div1 = div1s[i];
            if(positions[i]!=null){
                div1.style.position = 'absolute';
                div1.style.top = `${position.top + 23}px`;
                div1.style.left = `${position.left+ 833.3}px`;
                checkOverlap();
            }
        });
    }

    class BinaryTreeNode {
        constructor(rect) {
            this.rect = rect;
            this.left = null;
            this.right = null;
        }

        insert(width, height) {
            // If this node already has a left child, try inserting into the left subtree
            if (this.left) {
                const position = this.left.insert(width, height);
                if (position) {
                    return position;
                }

                // If the left subtree didn't work, try the right subtree
                return this.right.insert(width, height);
            }

            // If this node doesn't have a left child, check if it fits here
            if (width <= this.rect.right - this.rect.left && height <= this.rect.bottom - this.rect.top) {
                // It fits! Mark this node as occupied by expanding its rectangle
                const position = {
                    top: this.rect.top,
                    left: this.rect.left,
                    width,
                    height
                };
                this.left = new BinaryTreeNode({
                    top: this.rect.top,
                    left: this.rect.left + width,
                    right: this.rect.right,
                    bottom: this.rect.top + height
                });
                this.right = new BinaryTreeNode({
                    top: this.rect.top + height,
                    left: this.rect.left,
                    right: this.rect.right,
                    bottom: this.rect.bottom
                });
                return position;
            }
            return null;
        }
    }
}



function downloadDivImage() {
    var container = document.getElementById("container");
    html2canvas(container, { allowTaint: true }).then(function (canvas) {

        var link = document.createElement("a");
        document.body.appendChild(link);
        link.download = "html_image.jpg";
        link.href = canvas.toDataURL();
        link.target = '_blank';
        link.click();
    });

}
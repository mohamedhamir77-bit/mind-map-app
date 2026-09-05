const SUPABASE_URL =
    "https://ozjpfrserwtmceezvalo.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_RiJZXka04VC85cVq_hC_GA__fYN3q-Q";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);
const createTopicBtn = document.getElementById("createTopicBtn");
const topicList = document.getElementById("topicList");

const topicPage = document.getElementById("topicPage");
const topicTitle = document.getElementById("topicTitle");
const backBtn = document.getElementById("backBtn");

const addShapeBtn = document.getElementById("addShapeBtn");
const addLinkBtn = document.getElementById("addLinkBtn");
const removeLinkBtn = document.getElementById("removeLinkBtn");
const editLinkBtn = document.getElementById("editLinkBtn");
const canvas = document.getElementById("canvas");
const savedCanvasWidth = localStorage.getItem("canvasWidth");
const savedCanvasHeight = localStorage.getItem("canvasHeight");
const savedCanvasSizeMode =
    localStorage.getItem("canvasSizeMode");

if (savedCanvasWidth && savedCanvasHeight) {
    canvas.style.width = savedCanvasWidth + "px";
    canvas.style.height = savedCanvasHeight + "px";
}

const colourPicker = document.getElementById("colourPicker");
const borderColourPicker = document.getElementById("borderColourPicker");
const shapeType = document.getElementById("shapeType");
const connectBtn = document.getElementById("connectBtn");
const arrowEndBtn = document.getElementById("arrowEndBtn");
const boldBtn = document.getElementById("boldBtn");
const underlineBtn = document.getElementById("underlineBtn");
const fontDecreaseBtn = document.getElementById("fontDecreaseBtn");
const fontIncreaseBtn = document.getElementById("fontIncreaseBtn");
const fontColourPicker = document.getElementById("fontColourPicker");
let savedTextRange = null;
document.addEventListener("selectionchange", function () {

    const selection = window.getSelection();

    if (!selection.rangeCount || selection.isCollapsed) {
        return;
    }

    const range = selection.getRangeAt(0);

    let element = range.commonAncestorContainer;

    if (element.nodeType === Node.TEXT_NODE) {
        element = element.parentElement;
    }

    if (element && element.closest(".shape-text")) {
        savedTextRange = range.cloneRange();
    }
});
fontColourPicker.addEventListener("input", function () {

    if (!savedTextRange) {
        return;
    }

    const selection = window.getSelection();

    selection.removeAllRanges();
    selection.addRange(savedTextRange);

    document.execCommand(
        "foreColor",
        false,
        fontColourPicker.value
    );

    const range = selection.getRangeAt(0);

    let element = range.commonAncestorContainer;

    if (element.nodeType === Node.TEXT_NODE) {
        element = element.parentElement;
    }

    const textEditor =
        element && element.closest
            ? element.closest(".shape-text")
            : null;

    if (textEditor) {
        textEditor.dispatchEvent(
            new Event("input", { bubbles: true })
        );
    }
});
const deleteShapeBtn = document.getElementById("deleteShapeBtn");
const deleteLineBtn = document.getElementById("deleteLineBtn");
const deleteBendBtn = document.getElementById("deleteBendBtn");
const addBendBtn = document.getElementById("addBendBtn");
const canvasSizeSelect = document.getElementById("canvasSizeSelect");
const zoomOutBtn = document.getElementById("zoomOutBtn");
const zoomInBtn = document.getElementById("zoomInBtn");
const zoomFitBtn = document.getElementById("zoomFitBtn");
const zoomLevel = document.getElementById("zoomLevel");
const saveMindMapBtn = document.getElementById("saveMindMapBtn");
const openMindMapBtn = document.getElementById("openMindMapBtn");
const printMindMapBtn = document.getElementById("printMindMapBtn");
const mindMapFileInput = document.getElementById("mindMapFileInput");
boldBtn.addEventListener("mousedown", function (event) {
    event.preventDefault();
    document.execCommand("bold");
});
underlineBtn.addEventListener("mousedown", function (event) {
    event.preventDefault();
    document.execCommand("underline");
});
fontIncreaseBtn.addEventListener("mousedown", function (event) {

    event.preventDefault();

    const selection = window.getSelection();

    if (!selection.rangeCount || selection.isCollapsed) {
        return;
    }

    const range = selection.getRangeAt(0);

    const startElement =
        range.startContainer.nodeType === 3
            ? range.startContainer.parentElement
            : range.startContainer;

    const currentSize =
        parseFloat(window.getComputedStyle(startElement).fontSize);

    const span = document.createElement("span");
    span.style.fontSize = (currentSize + 2) + "px";

    const contents = range.extractContents();
    span.appendChild(contents);
    range.insertNode(span);

    selection.removeAllRanges();

    const newRange = document.createRange();
    newRange.selectNodeContents(span);

    selection.addRange(newRange);

    const textEditor = span.closest(".shape-text");

    if (textEditor) {
        textEditor.dispatchEvent(
            new Event("input", { bubbles: true })
        );
    }
});
fontDecreaseBtn.addEventListener("mousedown", function (event) {

    event.preventDefault();

    const selection = window.getSelection();

    if (!selection.rangeCount || selection.isCollapsed) {
        return;
    }

    const range = selection.getRangeAt(0);

    let sizeElement = range.startContainer;

    if (sizeElement.nodeType === Node.TEXT_NODE) {
        sizeElement = sizeElement.parentElement;
    } else {
        const firstTextNode = sizeElement.querySelector
            ? sizeElement.querySelector("span, b, strong, u, i, em")
            : null;

        if (firstTextNode) {
            sizeElement = firstTextNode;
        }
    }

    const currentSize =
        parseFloat(
            window.getComputedStyle(sizeElement).fontSize
        );

    const newSize =
        Math.max(currentSize - 2, 8);

    const span = document.createElement("span");
    span.style.fontSize = newSize + "px";

    const contents = range.extractContents();

    span.appendChild(contents);
    range.insertNode(span);

    selection.removeAllRanges();

    const newRange = document.createRange();
    newRange.selectNodeContents(span);
    selection.addRange(newRange);

    const textEditor = span.closest(".shape-text");

    if (textEditor) {
        textEditor.dispatchEvent(
            new Event("input", { bubbles: true })
        );
    }
});
deleteShapeBtn.addEventListener("click", function () {

    if (!selectedShape) {
        alert("Select a shape first.");
        return;
    }

    shapes[currentTopic] = shapes[currentTopic].filter(function (item) {
        return item !== selectedShape.savedData;
    });

    localStorage.setItem(
        "shapes",
        JSON.stringify(shapes)
    );

    selectedShape.remove();

if (shapeSelectionOutline) {
    shapeSelectionOutline.remove();
    shapeSelectionOutline = null;
}

selectedShape = null;

updateConnections();
});
deleteLineBtn.addEventListener("click", function () {

    if (!selectedConnection) {
        alert("Select a line first.");
        return;
    }

    const connectionData = connections.find(function (item) {
        return item.line === selectedConnection;
    });

    if (connectionData && connectionData.savedData) {
        savedConnections[currentTopic] =
            savedConnections[currentTopic].filter(function (item) {
                return item !== connectionData.savedData;
            });

        localStorage.setItem(
            "connections",
            JSON.stringify(savedConnections)
        );

        connections = connections.filter(function (item) {
            return item !== connectionData;
        });
    }

    selectedConnection.remove();

    removeLineHandles();

    selectedConnection = null;
    selectedConnectionData = null;
});
deleteBendBtn.addEventListener("click", function () {

    if (
        !selectedConnectionData ||
        selectedControlPointIndex === null
    ) {
        alert("Select a blue bend point first.");
        return;
    }

    const savedLine = selectedConnectionData.savedData;

    savedLine.controlPoints.splice(
        selectedControlPointIndex,
        1
    );

    selectedConnectionData.controlPoints =
        savedLine.controlPoints;

    localStorage.setItem(
        "connections",
        JSON.stringify(savedConnections)
    );

    selectedControlPointIndex = null;
    selectedControlPointHandle = null;

    updateConnections();

    showFreeLineControlHandles(
        selectedConnectionData.line,
        savedLine
    );
});
addBendBtn.addEventListener("click", function () {

    if (!selectedConnectionData || !selectedConnectionData.savedData) {
        alert("Select a line first.");
        return;
    }

    const savedLine = selectedConnectionData.savedData;
    const line = selectedConnectionData.line;

    if (!Array.isArray(savedLine.controlPoints)) {
        savedLine.controlPoints = [];
    }

    const totalLength = line.getTotalLength();

    const position =
        (savedLine.controlPoints.length + 1) /
        (savedLine.controlPoints.length + 2);

    const point = line.getPointAtLength(
        totalLength * position
    );

    savedLine.controlPoints.push({
        x: point.x,
        y: point.y
    });

    selectedConnectionData.controlPoints =
        savedLine.controlPoints;

    localStorage.setItem(
        "connections",
        JSON.stringify(savedConnections)
    );

    updateConnections();

    showFreeLineControlHandles(
        line,
        savedLine
    );
});
let selectedShape = null;
let shapeSelectionOutline = null;
let selectedConnection = null;
let selectedConnectionData = null;
let selectedControlPointIndex = null;
let selectedControlPointHandle = null;
let connectionHandle = null;
let connectionHandles = [];
let startHandle = null;
let endHandle = null;
let freeLineControlHandles = [];
function removeLineHandles() {

    if (connectionHandle) {
        connectionHandle.remove();
        connectionHandle = null;
    }

    connectionHandles.forEach(function (handle) {
        handle.remove();
    });

    connectionHandles = [];

    if (startHandle) {
        startHandle.remove();
        startHandle = null;
    }

    if (endHandle) {
        endHandle.remove();
        endHandle = null;
    }

    freeLineControlHandles.forEach(function (handle) {
        handle.remove();
    });

    freeLineControlHandles = [];

    selectedEndpoint = null;
    selectedControlPointIndex = null;
    selectedControlPointHandle = null;
}

freeLineControlHandles = [];
}
function showFreeLineControlHandles(line, savedLine) {

    freeLineControlHandles.forEach(function (handle) {
        handle.remove();
    });

    freeLineControlHandles = [];

    if (!Array.isArray(savedLine.controlPoints)) {
        savedLine.controlPoints = [];
    }

    const connectionLayer =
        document.getElementById("connectionLayer");

    savedLine.controlPoints.forEach(function (point, index) {

        const handle = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );

        handle.setAttribute("cx", point.x);
        handle.setAttribute("cy", point.y);
        handle.setAttribute("r", "8");
        handle.setAttribute("fill", "#2563eb");

        handle.style.pointerEvents = "all";
        handle.style.cursor = "move";
        handle.addEventListener("click", function (event) {

    event.stopPropagation();

    if (selectedControlPointHandle) {
        selectedControlPointHandle.removeAttribute("stroke");
        selectedControlPointHandle.removeAttribute("stroke-width");
    }

    selectedConnectionData = connections.find(function (item) {
        return item.line === line;
    });

    selectedControlPointIndex = index;
    selectedControlPointHandle = handle;

    handle.setAttribute("stroke", "#111827");
    handle.setAttribute("stroke-width", "3");
});
        handle.addEventListener("pointerdown", function (event) {

    event.stopPropagation();
    handle.setPointerCapture(event.pointerId);

    function moveHandle(event) {

        const canvasRect = canvas.getBoundingClientRect();

       point.x =
    (event.clientX - canvasRect.left) / canvasZoom;

point.y =
    (event.clientY - canvasRect.top) / canvasZoom;

        handle.setAttribute("cx", point.x);
        handle.setAttribute("cy", point.y);

        updateConnections();
    }

    function stopHandle(event) {

        localStorage.setItem(
            "connections",
            JSON.stringify(savedConnections)
        );

        handle.releasePointerCapture(event.pointerId);

        handle.removeEventListener(
            "pointermove",
            moveHandle
        );

        handle.removeEventListener(
            "pointerup",
            stopHandle
        );
    }

    handle.addEventListener(
        "pointermove",
        moveHandle
    );

    handle.addEventListener(
        "pointerup",
        stopHandle
    );
});

        connectionLayer.appendChild(handle);
        freeLineControlHandles.push(handle);
    });
}
let selectedEndpoint = null;
let firstConnectionShape = null;
let secondConnectionShape = null;
let connectionMode = false;
let connections = [];
let savedConnections = JSON.parse(localStorage.getItem("connections")) || {};

let topics = JSON.parse(localStorage.getItem("topics")) || [];
let shapes = JSON.parse(localStorage.getItem("shapes")) || {};
let currentTopic = localStorage.getItem("currentTopic");
addLinkBtn.addEventListener("click", function () {

    if (!selectedShape) {
        alert("Select a shape first.");
        return;
    }

    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
        alert("Highlight some text inside the shape first.");
        return;
    }

    const range = selection.getRangeAt(0);

    const selectedContainer =
        range.commonAncestorContainer.nodeType === Node.TEXT_NODE
            ? range.commonAncestorContainer.parentElement
            : range.commonAncestorContainer;

    if (!selectedShape.contains(selectedContainer)) {
        alert("Highlight some text inside the selected shape.");
        return;
    }

    const savedRange = range.cloneRange();

    let linkUrl = prompt(
        "Paste the website address:"
    );

    if (!linkUrl) {
        return;
    }

    linkUrl = linkUrl.trim();

    if (
        !linkUrl.startsWith("http://") &&
        !linkUrl.startsWith("https://")
    ) {
        linkUrl = "https://" + linkUrl;
    }

    const link = document.createElement("a");

    link.href = linkUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    const selectedContents = savedRange.extractContents();

    link.appendChild(selectedContents);

    savedRange.insertNode(link);

    const textEditor =
        selectedShape.querySelector(".shape-text");

    selectedShape.savedData.html =
        textEditor.innerHTML;

    selectedShape.savedData.text =
        textEditor.innerText;

    localStorage.setItem(
        "shapes",
        JSON.stringify(shapes)
    );

    selection.removeAllRanges();
});
removeLinkBtn.addEventListener("click", function () {

    if (!selectedShape) {
        alert("Select a shape first.");
        return;
    }

    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0) {
        alert("Click inside the linked text first.");
        return;
    }

    let node = selection.anchorNode;

    if (node && node.nodeType === Node.TEXT_NODE) {
        node = node.parentElement;
    }

    const link = node ? node.closest("a") : null;

    if (!link || !selectedShape.contains(link)) {
        alert("Click inside a link first.");
        return;
    }

    const parent = link.parentNode;

    while (link.firstChild) {
        parent.insertBefore(link.firstChild, link);
    }

    parent.removeChild(link);

    const textEditor =
        selectedShape.querySelector(".shape-text");

    selectedShape.savedData.html =
        textEditor.innerHTML;

    selectedShape.savedData.text =
        textEditor.innerText;

    localStorage.setItem(
        "shapes",
        JSON.stringify(shapes)
    );
});
editLinkBtn.addEventListener("click", function () {

    if (!selectedShape) {
        alert("Select a shape first.");
        return;
    }

    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0) {
        alert("Click inside a link first.");
        return;
    }

    let node = selection.anchorNode;

    if (node && node.nodeType === Node.TEXT_NODE) {
        node = node.parentElement;
    }

    const link = node ? node.closest("a") : null;

    if (!link || !selectedShape.contains(link)) {
        alert("Click inside a link first.");
        return;
    }

    let newUrl = prompt(
        "Edit website address:",
        link.href
    );

    if (!newUrl) {
        return;
    }

    newUrl = newUrl.trim();

    if (
        !newUrl.startsWith("http://") &&
        !newUrl.startsWith("https://")
    ) {
        newUrl = "https://" + newUrl;
    }

    link.href = newUrl;

    const textEditor =
        selectedShape.querySelector(".shape-text");

    selectedShape.savedData.html =
        textEditor.innerHTML;

    selectedShape.savedData.text =
        textEditor.innerText;

    localStorage.setItem(
        "shapes",
        JSON.stringify(shapes)
    );
});
topicTitle.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        event.preventDefault();
        topicTitle.blur();
    }

});

topicTitle.addEventListener("blur", function () {

    if (!currentTopic) {
        return;
    }

    const newTitle = topicTitle.textContent.trim();

    if (!newTitle) {
        topicTitle.textContent = currentTopic;
        return;
    }

    if (newTitle === currentTopic) {
        return;
    }

    if (topics.includes(newTitle)) {
        alert("A topic with that name already exists.");
        topicTitle.textContent = currentTopic;
        return;
    }

    const oldTitle = currentTopic;

    const topicIndex = topics.indexOf(oldTitle);

    if (topicIndex !== -1) {
        topics[topicIndex] = newTitle;
    }

    shapes[newTitle] = shapes[oldTitle] || [];
    delete shapes[oldTitle];

    savedConnections[newTitle] =
        savedConnections[oldTitle] || [];

    delete savedConnections[oldTitle];

    currentTopic = newTitle;

    localStorage.setItem(
        "topics",
        JSON.stringify(topics)
    );

    localStorage.setItem(
        "shapes",
        JSON.stringify(shapes)
    );

    localStorage.setItem(
        "connections",
        JSON.stringify(savedConnections)
    );

    localStorage.setItem(
        "currentTopic",
        currentTopic
    );

    topicTitle.textContent = currentTopic;

    displayTopics();

});
saveMindMapBtn.addEventListener("click", function () {

    if (!currentTopic) {
        alert("Open a topic first.");
        return;
    }

    const mindMapData = {
        version: 1,
        topic: currentTopic,

        canvas: {
            width: canvas.offsetWidth,
            height: canvas.offsetHeight,
            sizeMode: canvasSizeSelect.value
        },

        shapes: shapes[currentTopic] || [],
        connections: savedConnections[currentTopic] || []
    };

    const fileContents = JSON.stringify(
        mindMapData,
        null,
        2
    );

    const blob = new Blob(
        [fileContents],
        { type: "application/json" }
    );

    const downloadUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");

    const safeName = currentTopic
        .replace(/[^a-z0-9]/gi, "-")
        .replace(/-+/g, "-");

    link.href = downloadUrl;
    link.download = safeName + "-mind-map.json";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(downloadUrl);
});

openMindMapBtn.addEventListener("click", function () {
    mindMapFileInput.value = "";
    mindMapFileInput.click();
});
printMindMapBtn.addEventListener("click", function () {
    window.print();
});
mindMapFileInput.addEventListener("change", function (event) {

    const file = event.target.files[0];

    if (!file) {
        return;
    }

    const reader = new FileReader();

    reader.onload = function () {

        try {

            const mindMapData = JSON.parse(reader.result);

            if (
                !Array.isArray(mindMapData.shapes) ||
                !Array.isArray(mindMapData.connections)
            ) {
                throw new Error("Invalid mind map file");
            }

            const importedTopic =
                mindMapData.topic || "Imported Mind Map";

            currentTopic = importedTopic;

            if (!topics.includes(currentTopic)) {
                topics.push(currentTopic);

                localStorage.setItem(
                    "topics",
                    JSON.stringify(topics)
                );
            }

            shapes[currentTopic] = mindMapData.shapes;

            savedConnections[currentTopic] =
                mindMapData.connections;

            localStorage.setItem(
                "shapes",
                JSON.stringify(shapes)
            );

            localStorage.setItem(
                "connections",
                JSON.stringify(savedConnections)
            );

            localStorage.setItem(
                "currentTopic",
                currentTopic
            );

            if (mindMapData.canvas) {

                if (mindMapData.canvas.width) {
                    canvas.style.width =
                        mindMapData.canvas.width + "px";

                    localStorage.setItem(
                        "canvasWidth",
                        mindMapData.canvas.width
                    );
                }

                if (mindMapData.canvas.height) {
                    canvas.style.height =
                        mindMapData.canvas.height + "px";

                    localStorage.setItem(
                        "canvasHeight",
                        mindMapData.canvas.height
                    );
                }

                if (mindMapData.canvas.sizeMode) {
                    canvasSizeSelect.value =
                        mindMapData.canvas.sizeMode;

                    localStorage.setItem(
                        "canvasSizeMode",
                        mindMapData.canvas.sizeMode
                    );
                }
            }

            topicTitle.textContent = currentTopic;

            createTopicBtn.style.display = "none";
            topicList.style.display = "none";
            topicPage.style.display = "block";

            displayShapes();

            alert("Mind map opened successfully.");

        } catch (error) {

            alert("This file could not be opened as a mind map.");

        }

    };

    reader.readAsText(file);
});

function displayTopics() {

    topicList.innerHTML = "";

    topics.forEach(function (topic) {

        const newTopic = document.createElement("li");

        const topicButton = document.createElement("button");
        topicButton.type = "button";
        topicButton.textContent = topic;

        topicButton.addEventListener("click", function () {
            openTopic(topic);
        });

        newTopic.appendChild(topicButton);
        topicList.appendChild(newTopic);

    });
}


function openTopic(topic) {

    currentTopic = topic;
    if (!shapes[currentTopic]) {
    shapes[currentTopic] = [];
}
    localStorage.setItem("currentTopic", topic);

    createTopicBtn.style.display = "none";
    topicList.style.display = "none";

    topicTitle.textContent = topic;
    topicPage.style.display = "block";
displayShapes();
}
function displayShapes() {
    canvas.innerHTML = "";
    connections = [];
firstConnectionShape = null;
secondConnectionShape = null;
const newConnectionLayer = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
);

newConnectionLayer.id = "connectionLayer";
canvas.appendChild(newConnectionLayer);
const canvasResizeHandle = document.createElement("div");
canvasResizeHandle.id = "canvasResizeHandle";
canvas.appendChild(canvasResizeHandle);
const canvasSizeLabel = document.createElement("div");
canvasSizeLabel.id = "canvasSizeLabel";
canvasResizeHandle.appendChild(canvasSizeLabel);
const defs = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "defs"
);

const arrowMarker = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "marker"
);

arrowMarker.setAttribute("id", "arrowhead");
arrowMarker.setAttribute("markerWidth", "18");
arrowMarker.setAttribute("markerHeight", "18");
arrowMarker.setAttribute("refX", "6");
arrowMarker.setAttribute("refY", "3");
arrowMarker.setAttribute("orient", "auto-start-reverse");
arrowMarker.setAttribute("markerUnits", "userSpaceOnUse");
arrowMarker.setAttribute("viewBox", "0 0 6 6");

const arrowPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
);

arrowPath.setAttribute("d", "M0,0 L6,3 L0,6 z");
arrowPath.setAttribute("fill", "#111827");

arrowMarker.appendChild(arrowPath);
defs.appendChild(arrowMarker);
newConnectionLayer.appendChild(defs);
    const topicShapes = shapes[currentTopic] || [];

    topicShapes.forEach(function (savedShape) {
        if (!savedShape.id) {
    savedShape.id = Date.now().toString() + Math.random().toString(36).slice(2);
    localStorage.setItem("shapes", JSON.stringify(shapes));
}

        const shape = document.createElement("div");
shape.savedData = savedShape;

shape.classList.add("shape");
shape.classList.add(savedShape.type || "rounded");


const textEditor = document.createElement("div");
textEditor.classList.add("shape-text");

if (savedShape.type === "hover") {
    textEditor.contentEditable = "false";
    textEditor.textContent = "ⓘ";
    shape.classList.add("hover-symbol");
    shape.addEventListener("mouseenter", function () {

    keepHoverPopupOpen();

    showHoverContent(
        shape,
        savedShape
    );
});

shape.addEventListener("mouseleave", function () {
    scheduleHoverPopupHide();
});
} else {
    textEditor.contentEditable = "true";
    textEditor.innerHTML = savedShape.html || savedShape.text || "";
}

shape.appendChild(textEditor);
if (
    savedShape.attachments &&
    savedShape.attachments.length > 0
) {
    const attachmentBadge =
        document.createElement("div");

    attachmentBadge.classList.add("attachment-badge");

    attachmentBadge.textContent =
        "📎 " + savedShape.attachments.length;

    attachmentBadge.addEventListener(
    "mousedown",
    function (event) {
        event.preventDefault();
        event.stopPropagation();
    }
);

attachmentBadge.addEventListener(
    "click",
    function (event) {
        event.preventDefault();
        event.stopPropagation();
        showAttachmentPanel(shape);
    }
);

    shape.appendChild(attachmentBadge);
}
textEditor.addEventListener("click", function (event) {

    const link = event.target.closest("a");

    if (!link) {
        return;
    }

    event.preventDefault();
    event.stopPropagation();

    window.open(
        link.href,
        "_blank",
        "noopener,noreferrer"
    );
});
const dragHandle = document.createElement("div");
dragHandle.classList.add("drag-handle");
dragHandle.textContent = "⠿";

shape.appendChild(dragHandle);
textEditor.addEventListener("input", function () {

    savedShape.html = textEditor.innerHTML;
    savedShape.text = textEditor.innerText;

 if (
    savedShape.type === "diamond" &&
    diamondTextNeedsMoreRoom(shape, textEditor)
) {

    const textHeight = Math.max(
        40,
        textEditor.scrollHeight - 100
    );

   const newSize = Math.max(
    shape.offsetWidth,
    textHeight * 2.4
);

    shape.style.width = newSize + "px";
    shape.style.height = newSize + "px";

    savedShape.width = shape.offsetWidth;
    savedShape.height = shape.offsetHeight;

} else if (textEditor.scrollHeight > shape.offsetHeight) {

    shape.style.height = textEditor.scrollHeight + "px";
    savedShape.height = shape.offsetHeight;
}

    localStorage.setItem(
        "shapes",
        JSON.stringify(shapes)
    );

    updateConnections();
});

        shape.style.background = savedShape.colour;
        shape.style.setProperty("--diamond-colour", savedShape.colour);
        if (savedShape.borderColour) {

    if (savedShape.type === "diamond") {

        shape.classList.add("custom-border");

        shape.style.background =
            savedShape.borderColour;

        shape.style.setProperty(
            "--diamond-colour",
            savedShape.colour
        );

    } else {

        shape.style.boxShadow =
            `0 0 0 4px ${savedShape.borderColour}`;
    }
}
        shape.style.left = savedShape.left + "px";
shape.style.top = savedShape.top + "px";
if (savedShape.width) {
    shape.style.width = savedShape.width + "px";
}

if (savedShape.height) {
    shape.style.height = savedShape.height + "px";
}
const resizeHandle = document.createElement("div");
resizeHandle.classList.add("resize-handle");
shape.appendChild(resizeHandle);
["top", "right", "bottom", "left"].forEach(function (position) {

    const point = document.createElement("div");

    point.classList.add("connection-point");
    point.classList.add(position);

    shape.appendChild(point);
});
makeResizable(shape, resizeHandle);
        canvas.appendChild(shape);

        makeDraggable(shape);
       shape.addEventListener("click", function () {
        
    
        console.log("Clicked shape:", shape.className);
if (selectedShape === shape && !connectionMode) {
    return;
}
    if (selectedShape && selectedShape !== shape) {
    selectedShape.classList.remove("shape-selected");
}

selectedShape = shape;
setSidebarMode(
    shape.savedData.type === "hover"
        ? "hover"
        : "shape"
);

showHoverTools(
    shape.savedData.type === "hover"
);

showNormalShapeTools(
    shape.savedData.type !== "hover"
);

if (shape.savedData.type === "hover") {

    shape.classList.add("shape-selected");

    if (shapeSelectionOutline) {
        shapeSelectionOutline.remove();
        shapeSelectionOutline = null;
    }

    return;
}

selectedShape.classList.add("shape-selected");

if (shapeSelectionOutline) {
    shapeSelectionOutline.remove();
    shapeSelectionOutline = null;
}

if (shape.classList.contains("diamond")) {
    const outline = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polygon"
    );

  const gap = 4;

const left = shape.offsetLeft - gap;
const top = shape.offsetTop - gap;
const width = shape.offsetWidth + gap * 2;
const height = shape.offsetHeight + gap * 2;

    outline.setAttribute(
        "points",
        `${left + width / 2},${top} ` +
        `${left + width},${top + height / 2} ` +
        `${left + width / 2},${top + height} ` +
        `${left},${top + height / 2}`
    );

    outline.setAttribute("fill", "none");
    outline.setAttribute("stroke", "#111827");
    outline.setAttribute("stroke-width", "3");
    outline.setAttribute("pointer-events", "none");

    connectionLayer.appendChild(outline);
    shapeSelectionOutline = outline;
}
if (!connectionMode) {
    return;
}

    if (shape === firstConnectionShape) {
        shape.classList.remove("connection-selected");
        firstConnectionShape = null;
        return;
    }

    if (shape === secondConnectionShape) {
        shape.classList.remove("connection-selected");
        secondConnectionShape = null;
        return;
    }

    if (!firstConnectionShape) {
        firstConnectionShape = shape;
        shape.classList.add("connection-selected");
        return;
    }

   if (!secondConnectionShape) {
    secondConnectionShape = shape;
    shape.classList.add("connection-selected");

    drawConnection(firstConnectionShape, secondConnectionShape);

    firstConnectionShape.classList.remove("connection-selected");
    secondConnectionShape.classList.remove("connection-selected");

    firstConnectionShape = null;
    secondConnectionShape = null;
    connectionMode = false;

    return;
}

});

    });
    const topicConnections = savedConnections[currentTopic] || [];
    topicConnections.forEach(function (savedConnection) {

    if (savedConnection.type === "freeLine") {

        const connectionLayer =
            document.getElementById("connectionLayer");

        const line = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );

        line.setAttribute(
            "d",
            `M ${savedConnection.x1} ${savedConnection.y1} ` +
            `L ${savedConnection.x2} ${savedConnection.y2}`
        );

        line.setAttribute("fill", "none");
        line.setAttribute("stroke", "#111827");
        line.setAttribute("stroke-width", "3");
        if (savedConnection.arrowStart) {
    line.setAttribute("marker-start", "url(#arrowhead)");
}

if (savedConnection.arrowEnd) {
    line.setAttribute("marker-end", "url(#arrowhead)");
}
line.style.pointerEvents = "stroke";
line.style.cursor = "pointer";

line.addEventListener("click", function (event) {
    event.stopPropagation();

    if (selectedConnection === line) {
    line.setAttribute("stroke-width", "3");
    selectedConnection = null;

   removeLineHandles();

    return;
}

    if (selectedConnection) {
        selectedConnection.setAttribute("stroke-width", "3");
    }

    selectedConnection = line;

selectedConnectionData = connections.find(function (item) {
    return item.line === line;
});

line.setAttribute("stroke-width", "5");
   removeLineHandles();
startHandle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
);

startHandle.setAttribute("cx", savedConnection.x1);
startHandle.setAttribute("cy", savedConnection.y1);
startHandle.setAttribute("r", "7");
startHandle.setAttribute("fill", "#111827");

endHandle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
);

endHandle.setAttribute("cx", savedConnection.x2);
endHandle.setAttribute("cy", savedConnection.y2);
endHandle.setAttribute("r", "7");
endHandle.setAttribute("fill", "#111827");
startHandle.style.pointerEvents = "all";
startHandle.style.cursor = "grab";
startHandle.addEventListener("click", function (event) {

    event.stopPropagation();

    if (selectedEndpoint === "start") {
        startHandle.removeAttribute("stroke");
        startHandle.removeAttribute("stroke-width");
        selectedEndpoint = null;
        return;
    }

    if (endHandle) {
        endHandle.removeAttribute("stroke");
        endHandle.removeAttribute("stroke-width");
    }

    selectedEndpoint = "start";

    startHandle.setAttribute("stroke", "#2563eb");
    startHandle.setAttribute("stroke-width", "4");
});
startHandle.addEventListener("mousedown", function (event) {
    event.stopPropagation();

    function moveStartHandle(event) {
        const canvasRect = canvas.getBoundingClientRect();

       const newX =
    (event.clientX - canvasRect.left) / canvasZoom;

const newY =
    (event.clientY - canvasRect.top) / canvasZoom;
const snap = findNearestSnapPort(newX, newY);
        if (snap && snap.distance <= 30) {
    savedConnection.x1 = snap.port.x;
    savedConnection.y1 = snap.port.y;
    savedConnection.shape1Id = snap.shape.savedData.id;
    savedConnection.point1Index = snap.portIndex;
} else {
    savedConnection.x1 = newX;
    savedConnection.y1 = newY;
    savedConnection.shape1Id = null;
    savedConnection.point1Index = null;
}

       startHandle.setAttribute("cx", savedConnection.x1);
startHandle.setAttribute("cy", savedConnection.y1);

        updateConnections();
    }

    function stopMovingStartHandle() {
        document.removeEventListener("mousemove", moveStartHandle);
        document.removeEventListener("mouseup", stopMovingStartHandle);

        localStorage.setItem(
            "connections",
            JSON.stringify(savedConnections)
        );
    }

    document.addEventListener("mousemove", moveStartHandle);
    document.addEventListener("mouseup", stopMovingStartHandle);
});
endHandle.style.pointerEvents = "all";
endHandle.style.cursor = "grab";
endHandle.addEventListener("click", function (event) {

    event.stopPropagation();

    if (selectedEndpoint === "end") {
        endHandle.removeAttribute("stroke");
        endHandle.removeAttribute("stroke-width");
        selectedEndpoint = null;
        return;
    }

    if (startHandle) {
        startHandle.removeAttribute("stroke");
        startHandle.removeAttribute("stroke-width");
    }

    selectedEndpoint = "end";

    endHandle.setAttribute("stroke", "#2563eb");
    endHandle.setAttribute("stroke-width", "4");
});
endHandle.addEventListener("mousedown", function (event) {
    event.stopPropagation();

    function moveEndHandle(event) {
        const canvasRect = canvas.getBoundingClientRect();

        const newX =
    (event.clientX - canvasRect.left) / canvasZoom;

const newY =
    (event.clientY - canvasRect.top) / canvasZoom;
const snap = findNearestSnapPort(newX, newY);
      if (snap && snap.distance <= 30) {
    savedConnection.x2 = snap.port.x;
    savedConnection.y2 = snap.port.y;
    savedConnection.shape2Id = snap.shape.savedData.id;
    savedConnection.point2Index = snap.portIndex;
} else {
    savedConnection.x2 = newX;
    savedConnection.y2 = newY;
    savedConnection.shape2Id = null;
    savedConnection.point2Index = null;
}

        endHandle.setAttribute("cx", savedConnection.x2);
endHandle.setAttribute("cy", savedConnection.y2);

        updateConnections();
    }

    function stopMovingEndHandle() {
        document.removeEventListener("mousemove", moveEndHandle);
        document.removeEventListener("mouseup", stopMovingEndHandle);

        localStorage.setItem(
            "connections",
            JSON.stringify(savedConnections)
        );
    }

    document.addEventListener("mousemove", moveEndHandle);
    document.addEventListener("mouseup", stopMovingEndHandle);
});
connectionLayer.appendChild(startHandle);
connectionLayer.appendChild(endHandle);
 showFreeLineControlHandles(
    line,
    savedConnection
);
});
line.addEventListener("dblclick", function (event) {

    event.stopPropagation();

    const canvasRect = canvas.getBoundingClientRect();

    const x =
    (event.clientX - canvasRect.left) / canvasZoom;

const y =
    (event.clientY - canvasRect.top) / canvasZoom;

    savedConnection.controlPoints.push({
        x: x,
        y: y
    });

    localStorage.setItem(
        "connections",
        JSON.stringify(savedConnections)
    );

    updateConnections();

    showFreeLineControlHandles(
        line,
        savedConnection
    );
});
        connectionLayer.appendChild(line);
        if (!Array.isArray(savedConnection.controlPoints)) {
    savedConnection.controlPoints = [];
}

connections.push({
    type: "freeLine",
    line: line,
    savedData: savedConnection,
    controlPoints: savedConnection.controlPoints
});
updateConnections();
        return;
    }
});

topicConnections.forEach(function (savedConnection) {
    if (savedConnection.type === "freeLine") {
    return;
}

    const shape1 = Array.from(canvas.querySelectorAll(".shape")).find(function (shape) {
        return shape.savedData.id === savedConnection.shape1Id;
    });

    const shape2 = Array.from(canvas.querySelectorAll(".shape")).find(function (shape) {
        return shape.savedData.id === savedConnection.shape2Id;
    });

    if (shape1 && shape2) {
    drawConnection(
        shape1,
        shape2,
        false,
        savedConnection
    );
}
});
}

backBtn.addEventListener("click", function () {

    topicPage.style.display = "none";

    createTopicBtn.style.display = "inline-block";
    topicList.style.display = "block";

});


createTopicBtn.addEventListener("click", function () {

    const topicName = prompt("What would you like to call this topic?");

    if (topicName) {

        topics.push(topicName);

        localStorage.setItem("topics", JSON.stringify(topics));
displayTopics();

scheduleCloudSave();

    }

});


addShapeBtn.addEventListener("click", function () {

    const shape = document.createElement("div");

    shape.classList.add("shape");

const textEditor = document.createElement("div");
textEditor.classList.add("shape-text");
textEditor.contentEditable = "true";
if (shapeType.value === "hover") {
    textEditor.textContent = "ⓘ";
} else {
    textEditor.textContent = "New Shape";
}

shape.appendChild(textEditor);
textEditor.addEventListener("click", function (event) {

    const link = event.target.closest("a");

    if (!link) {
        return;
    }

    event.preventDefault();
    event.stopPropagation();

    window.open(
        link.href,
        "_blank",
        "noopener,noreferrer"
    );
});
const dragHandle = document.createElement("div");
dragHandle.classList.add("drag-handle");
dragHandle.textContent = "⠿";

shape.appendChild(dragHandle);
textEditor.addEventListener("input", function () {

    shape.savedData.html = textEditor.innerHTML;
    shape.savedData.text = textEditor.innerText;

    if (
    shape.savedData.type === "diamond" &&
    diamondTextNeedsMoreRoom(shape, textEditor)
) {

        const neededHeight = textEditor.scrollHeight + 100;

        const neededWidth = Math.max(
            shape.offsetWidth,
            neededHeight * 0.9
        );

        shape.style.height = neededHeight + "px";
        shape.style.width = neededWidth + "px";

        shape.savedData.height = shape.offsetHeight;
        shape.savedData.width = shape.offsetWidth;

    } else if (textEditor.scrollHeight > shape.offsetHeight) {

        shape.style.height = textEditor.scrollHeight + "px";
        shape.savedData.height = shape.offsetHeight;
    }

    localStorage.setItem(
        "shapes",
        JSON.stringify(shapes)
    );

    updateConnections();
});

canvas.appendChild(shape);
    
if (!shapes[currentTopic]) {
    shapes[currentTopic] = [];
}

const newShapeData = {
    id: Date.now().toString(),
    text: shapeType.value === "hover" ? "ⓘ" : "New Shape",
    left: 50,
    top: 50,
    colour: "#facc15",
    type: shapeType.value,
hoverText: ""
};

shapes[currentTopic].push(newShapeData);

shape.savedData = newShapeData;
shape.classList.add(newShapeData.type);
if (newShapeData.type === "hover") {
    textEditor.contentEditable = "false";
    textEditor.textContent = "ⓘ";
    newShapeData.text = "ⓘ";
    newShapeData.html = "ⓘ";
}
if (newShapeData.type === "hover") {
    shape.classList.add("hover-symbol");

    shape.addEventListener("mouseenter", function () {

    keepHoverPopupOpen();

    showHoverContent(
        shape,
        newShapeData
    );
});

    shape.addEventListener("mouseleave", function () {
    scheduleHoverPopupHide();
});
}
const resizeHandle = document.createElement("div");
resizeHandle.classList.add("resize-handle");
shape.appendChild(resizeHandle);

makeResizable(shape, resizeHandle);

localStorage.setItem("shapes", JSON.stringify(shapes));
    makeDraggable(shape);
    shape.addEventListener("click", function () {

   if (selectedShape === shape && !connectionMode) {
    return;
}

if (selectedShape && selectedShape !== shape) {
    selectedShape.classList.remove("shape-selected");
}

selectedShape = shape;
setSidebarMode(
    shape.savedData.type === "hover"
        ? "hover"
        : "shape"
);
showHoverTools(
    shape.savedData.type === "hover"
);
showNormalShapeTools(
    shape.savedData.type !== "hover"
);
if (shape.savedData.type === "hover") {

    shape.classList.add("shape-selected");

    if (shapeSelectionOutline) {
        shapeSelectionOutline.remove();
        shapeSelectionOutline = null;
    }

    return;
}

selectedShape.classList.add("shape-selected");

if (shapeSelectionOutline) {
    shapeSelectionOutline.remove();
    shapeSelectionOutline = null;
}

if (shape.classList.contains("diamond")) {
    const outline = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polygon"
    );

    const gap = 4;

    const left = shape.offsetLeft - gap;
    const top = shape.offsetTop - gap;
    const width = shape.offsetWidth + gap * 2;
    const height = shape.offsetHeight + gap * 2;

    outline.setAttribute(
        "points",
        `${left + width / 2},${top} ` +
        `${left + width},${top + height / 2} ` +
        `${left + width / 2},${top + height} ` +
        `${left},${top + height / 2}`
    );

    outline.setAttribute("fill", "none");
    outline.setAttribute("stroke", "#111827");
    outline.setAttribute("stroke-width", "3");
    outline.setAttribute("pointer-events", "none");

    const connectionLayer =
        document.getElementById("connectionLayer");

    connectionLayer.appendChild(outline);
    shapeSelectionOutline = outline;
}
if (!connectionMode) {
    return;
}

    if (shape === firstConnectionShape) {
        shape.classList.remove("connection-selected");
        firstConnectionShape = null;
        return;
    }

    if (shape === secondConnectionShape) {
        shape.classList.remove("connection-selected");
        secondConnectionShape = null;
        return;
    }

    if (!firstConnectionShape) {
        firstConnectionShape = shape;
        shape.classList.add("connection-selected");
        return;
    }

    if (!secondConnectionShape) {
        secondConnectionShape = shape;
        shape.classList.add("connection-selected");
        return;
    }

});

    

});


function makeDraggable(shape) {

    let offsetX = 0;
    let offsetY = 0;
    let dragging = false;

    shape.addEventListener("mousedown", function (event) {

   if (
    event.target.closest(".shape-text") &&
    shape.savedData.type !== "hover"
) {
    dragging = false;
    return;
}

    if (shape.savedData.type !== "hover") {

    const resizeCorner = 20;

    const nearRight =
        event.offsetX > shape.offsetWidth - resizeCorner;

    const nearBottom =
        event.offsetY > shape.offsetHeight - resizeCorner;

    if (nearRight && nearBottom) {
        dragging = false;
        return;
    }
}

    dragging = true;
    if (shape.savedData.type === "hover") {
    shape.classList.add("dragging-hover");
}
const canvasRect = canvas.getBoundingClientRect();

offsetX =
    (event.clientX - canvasRect.left) / canvasZoom -
    shape.offsetLeft;

offsetY =
    (event.clientY - canvasRect.top) / canvasZoom -
    shape.offsetTop;

});

    document.addEventListener("mousemove", function (event) {

        if (dragging) {

        const canvasRect = canvas.getBoundingClientRect();

const newLeft =
    (event.clientX - canvasRect.left) / canvasZoom -
    offsetX;

const newTop =
    (event.clientY - canvasRect.top) / canvasZoom -
    offsetY;

shape.style.left = newLeft + "px";
shape.style.top = newTop + "px";
updateConnections();
        }

    });

    document.addEventListener("mouseup", function () {
        if (shape.savedData.type === "hover") {
    shape.classList.remove("dragging-hover");
}

    if (dragging && shape.savedData) {

        shape.savedData.left = shape.offsetLeft;
        shape.savedData.top = shape.offsetTop;

        localStorage.setItem("shapes", JSON.stringify(shapes));
    }
if (shape.savedData.type === "hover") {
    shape.classList.remove("dragging-hover");
}
    dragging = false;
});

}

colourPicker.addEventListener("input", function () {

    if (selectedShape) {
        selectedShape.style.background = colourPicker.value;

        if (selectedShape.savedData) {
            selectedShape.savedData.colour = colourPicker.value;
            localStorage.setItem("shapes", JSON.stringify(shapes));
        }
    }

});
borderColourPicker.addEventListener("input", function () {

    if (!selectedShape) {
        return;
    }

    const borderColour = borderColourPicker.value;

    selectedShape.savedData.borderColour = borderColour;

    if (selectedShape.classList.contains("diamond")) {

    selectedShape.style.filter = "";

    selectedShape.classList.add("custom-border");

    selectedShape.style.background = borderColour;

    selectedShape.style.setProperty(
        "--diamond-colour",
        selectedShape.savedData.colour || "#facc15"
    );

} else {

    selectedShape.style.boxShadow =
        `0 0 0 4px ${borderColour}`;
}
    localStorage.setItem(
        "shapes",
        JSON.stringify(shapes)
    );
});
function diamondTextNeedsMoreRoom(shape, textEditor) {

    const safeHeight = shape.offsetHeight * 0.45;

    return textEditor.scrollHeight > safeHeight;
}
function makeResizable(shape, handle) {

    handle.addEventListener("mousedown", function (event) {

        event.stopPropagation();
        


        const startX = event.clientX;
        const startY = event.clientY;

        const startWidth = shape.offsetWidth;
        const startHeight = shape.offsetHeight;

       function resize(event) {

    shape.style.width =
        startWidth +
        ((event.clientX - startX) / canvasZoom) +
        "px";

    shape.style.height =
        startHeight +
        ((event.clientY - startY) / canvasZoom) +
        "px";

    updateConnections();
}

        function stopResize() {

    if (shape.savedData) {
        shape.savedData.width = shape.offsetWidth;
        shape.savedData.height = shape.offsetHeight;

        localStorage.setItem("shapes", JSON.stringify(shapes));
    }

    document.removeEventListener("mousemove", resize);
    document.removeEventListener("mouseup", stopResize);
}

        document.addEventListener("mousemove", resize);
        document.addEventListener("mouseup", stopResize);

    });
}

connectBtn.addEventListener("click", function () {

   const connectionLayer =
    document.getElementById("connectionLayer");

const line = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
);

const freeLineData = {
    x1: 150,
    y1: 80,
    x2: 350,
    y2: 80
};
const savedFreeLine = {
    type: "freeLine",
    ...freeLineData,
    controlPoints: []
};

    line.setAttribute(
        "d",
        `M ${freeLineData.x1} ${freeLineData.y1} ` +
        `L ${freeLineData.x2} ${freeLineData.y2}`
    );

    line.setAttribute("fill", "none");
    line.setAttribute("stroke", "#111827");
    line.setAttribute("stroke-width", "3");
    
    line.style.pointerEvents = "stroke";
line.style.cursor = "pointer";

line.addEventListener("click", function (event) {
    event.stopPropagation();

   if (selectedConnection === line) {
    line.setAttribute("stroke-width", "3");
    selectedConnection = null;

    removeLineHandles();

    return;
}

    if (selectedConnection) {
        selectedConnection.setAttribute("stroke-width", "3");
    }

    selectedConnection = line;

selectedConnectionData = connections.find(function (item) {
    return item.line === line;
});

line.setAttribute("stroke-width", "5");
    removeLineHandles();

startHandle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
);

startHandle.setAttribute("cx", savedFreeLine.x1);
startHandle.setAttribute("cy", savedFreeLine.y1);
startHandle.setAttribute("r", "7");
startHandle.setAttribute("fill", "#111827");

endHandle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
);

endHandle.setAttribute("cx", savedFreeLine.x2);
endHandle.setAttribute("cy", savedFreeLine.y2);
endHandle.setAttribute("r", "7");
endHandle.setAttribute("fill", "#111827");
startHandle.style.pointerEvents = "all";
startHandle.style.cursor = "grab";
startHandle.addEventListener("click", function (event) {

    event.stopPropagation();

    if (selectedEndpoint === "start") {
        startHandle.removeAttribute("stroke");
        startHandle.removeAttribute("stroke-width");
        selectedEndpoint = null;
        return;
    }

    if (endHandle) {
        endHandle.removeAttribute("stroke");
        endHandle.removeAttribute("stroke-width");
    }

    selectedEndpoint = "start";

    startHandle.setAttribute("stroke", "#2563eb");
    startHandle.setAttribute("stroke-width", "4");
});

startHandle.addEventListener("mousedown", function (event) {
    event.stopPropagation();

    function moveStartHandle(event) {
        const canvasRect = canvas.getBoundingClientRect();

        const newX =
    (event.clientX - canvasRect.left) / canvasZoom;

const newY =
    (event.clientY - canvasRect.top) / canvasZoom;

        const snap = findNearestSnapPort(newX, newY);

if (snap && snap.distance <= 30) {
    savedFreeLine.x1 = snap.port.x;
    savedFreeLine.y1 = snap.port.y;
    savedFreeLine.shape1Id = snap.shape.savedData.id;
    savedFreeLine.point1Index = snap.portIndex;
} else {
    savedFreeLine.x1 = newX;
    savedFreeLine.y1 = newY;
    savedFreeLine.shape1Id = null;
    savedFreeLine.point1Index = null;
}
      startHandle.setAttribute("cx", savedFreeLine.x1);
startHandle.setAttribute("cy", savedFreeLine.y1);

        
    updateConnections();
    }

    document.addEventListener("mousemove", moveStartHandle);

    document.addEventListener("mouseup", function stopMovingStartHandle() {
        document.removeEventListener("mousemove", moveStartHandle);
        document.removeEventListener("mouseup", stopMovingStartHandle);

        localStorage.setItem(
            "connections",
            JSON.stringify(savedConnections)
        );
    });
});
endHandle.style.pointerEvents = "all";
endHandle.style.cursor = "grab";
endHandle.addEventListener("click", function (event) {

    event.stopPropagation();

    if (selectedEndpoint === "end") {
        endHandle.removeAttribute("stroke");
        endHandle.removeAttribute("stroke-width");
        selectedEndpoint = null;
        return;
    }

    if (startHandle) {
        startHandle.removeAttribute("stroke");
        startHandle.removeAttribute("stroke-width");
    }

    selectedEndpoint = "end";

    endHandle.setAttribute("stroke", "#2563eb");
    endHandle.setAttribute("stroke-width", "4");
});
endHandle.addEventListener("mousedown", function (event) {
    event.stopPropagation();

    function moveEndHandle(event) {
        const canvasRect = canvas.getBoundingClientRect();

        const newX =
    (event.clientX - canvasRect.left) / canvasZoom;

const newY =
    (event.clientY - canvasRect.top) / canvasZoom;

        const snap = findNearestSnapPort(newX, newY);

if (snap && snap.distance <= 30) {
    savedFreeLine.x2 = snap.port.x;
    savedFreeLine.y2 = snap.port.y;
    savedFreeLine.shape2Id = snap.shape.savedData.id;
    savedFreeLine.point2Index = snap.portIndex;
} else {
    savedFreeLine.x2 = newX;
    savedFreeLine.y2 = newY;
    savedFreeLine.shape2Id = null;
    savedFreeLine.point2Index = null;
}

        endHandle.setAttribute("cx", savedFreeLine.x2);
        endHandle.setAttribute("cy", savedFreeLine.y2);

        updateConnections();
    }

    function stopMovingEndHandle() {
        document.removeEventListener("mousemove", moveEndHandle);
        document.removeEventListener("mouseup", stopMovingEndHandle);

        localStorage.setItem(
            "connections",
            JSON.stringify(savedConnections)
        );
    }

    document.addEventListener("mousemove", moveEndHandle);
    document.addEventListener("mouseup", stopMovingEndHandle);
});
connectionLayer.appendChild(startHandle);
connectionLayer.appendChild(endHandle);
showFreeLineControlHandles(
    line,
    savedFreeLine
);
    


});
line.addEventListener("dblclick", function (event) {

    event.stopPropagation();

    const canvasRect = canvas.getBoundingClientRect();

    const x =
    (event.clientX - canvasRect.left) / canvasZoom;

const y =
    (event.clientY - canvasRect.top) / canvasZoom;

    savedFreeLine.controlPoints.push({
        x: x,
        y: y
    });

    localStorage.setItem(
        "connections",
        JSON.stringify(savedConnections)
    );

    updateConnections();

    showFreeLineControlHandles(
        line,
        savedFreeLine
    );
});
    connectionLayer.appendChild(line);
connections.push({
    type: "freeLine",
    line: line,
    savedData: savedFreeLine,
    controlPoints: savedFreeLine.controlPoints
});
    if (!savedConnections[currentTopic]) {
        savedConnections[currentTopic] = [];
    }

    

savedConnections[currentTopic].push(savedFreeLine);

    localStorage.setItem(
        "connections",
        JSON.stringify(savedConnections)
    );
    line.dispatchEvent(new MouseEvent("click", { bubbles: true }));
});

function drawConnection(
    shape1,
    shape2,
    shouldSave = true,
    savedConnection = null
) {

    const connectionLayer = document.getElementById("connectionLayer");

const line = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
);

line.setAttribute("fill", "none");
line.setAttribute("stroke", "#111827");
line.setAttribute("stroke-width", "3");

if (savedConnection && savedConnection.arrowStart) {
    line.setAttribute("marker-start", "url(#arrowhead)");
}
if (savedConnection && savedConnection.arrowEnd) {
    line.setAttribute("marker-end", "url(#arrowhead)");
}
line.style.pointerEvents = "stroke";
line.style.cursor = "pointer";
line.addEventListener("click", function (event) {

    event.stopPropagation();

   if (selectedConnection === line) {

    line.setAttribute("stroke-width", "3");

    selectedConnection = null;
    selectedConnectionData = null;

    if (connectionHandle) {
        connectionHandle.remove();
        connectionHandle = null;
    }

    connectionHandles.forEach(function (handle) {
        handle.remove();
    });

    connectionHandles = [];

    if (startHandle) {
        startHandle.remove();
        startHandle = null;
    }

    if (endHandle) {
        endHandle.remove();
        endHandle = null;
    }

    selectedEndpoint = null;
    selectedControlPointIndex = null;
    selectedControlPointHandle = null;

    return;
}

if (selectedConnection) {
    selectedConnection.setAttribute("stroke-width", "3");
}

    selectedConnection = line;
    selectedConnectionData = connections.find(function (item) {
    return item.line === line;
});
if (
    selectedConnectionData &&
    selectedConnectionData.controlPoints.length === 0
) {
    const totalLength = line.getTotalLength();

    const middlePoint =
        line.getPointAtLength(totalLength / 2);

    selectedConnectionData.controlPoints.push({
    x: middlePoint.x,
    y: middlePoint.y,
    offsetX: 0,
    offsetY: 0,
    followsLine: true
});

    if (selectedConnectionData.savedData) {
        selectedConnectionData.savedData.controlPoints =
            selectedConnectionData.controlPoints.map(function (point) {
                return { ...point };
            });

        localStorage.setItem(
            "connections",
            JSON.stringify(savedConnections)
        );
    }
}
    line.setAttribute("stroke-width", "5");
    showConnectionHandle(line);

});
line.addEventListener("dblclick", function (event) {

    event.stopPropagation();

    const canvasRect = canvas.getBoundingClientRect();

    const x =
    (event.clientX - canvasRect.left) / canvasZoom;

const y =
    (event.clientY - canvasRect.top) / canvasZoom;

    const connection = connections.find(function (item) {
        return item.line === line;
    });

    if (!connection) {
        return;
    }

    const totalLength = line.getTotalLength();

function findPositionOnLine(pointX, pointY) {

    let closestLength = 0;
    let closestDistance = Infinity;

    for (let i = 0; i <= 100; i++) {

        const length =
            totalLength * (i / 100);

        const point =
            line.getPointAtLength(length);

        const distance = Math.hypot(
            point.x - pointX,
            point.y - pointY
        );

        if (distance < closestDistance) {
            closestDistance = distance;
            closestLength = length;
        }
    }

    return closestLength;
}

const newPointPosition =
    findPositionOnLine(x, y);

let insertIndex =
    connection.controlPoints.length;

connection.controlPoints.forEach(
    function (point, index) {

        const existingPosition =
            findPositionOnLine(point.x, point.y);

        if (
            newPointPosition < existingPosition &&
            insertIndex === connection.controlPoints.length
        ) {
            insertIndex = index;
        }
    }
);
const positionRatio =
    totalLength === 0
        ? 0.5
        : newPointPosition / totalLength;
connection.controlPoints.splice(
    insertIndex,
    0,
    {
    x: x,
    y: y,
    offsetX: 0,
    offsetY: 0,
    followsConnection: true,
    positionRatio: positionRatio
}
);
if (connection.savedData) {
    connection.savedData.controlPoints =
        connection.controlPoints.map(function (point) {
            return { ...point };
        });

    localStorage.setItem(
        "connections",
        JSON.stringify(savedConnections)
    );
}
    showConnectionHandle(line);
    updateConnections();
});
  const bestPoints = getBestConnectionPoints(
    shape1,
    shape2
);

const ports1 = getConnectionPorts(shape1);
const ports2 = getConnectionPorts(shape2);

const point1 =
    savedConnection &&
    typeof savedConnection.point1Index === "number"
        ? ports1[savedConnection.point1Index]
        : bestPoints.point1;

const point2 =
    savedConnection &&
    typeof savedConnection.point2Index === "number"
        ? ports2[savedConnection.point2Index]
        : bestPoints.point2;

const x1 = point1.x;
const y1 = point1.y;

const x2 = point2.x;
const y2 = point2.y;

   const pathData = getSmartPath(
    shape1,
    shape2,
    x1,
    y1,
    x2,
    y2
);

line.setAttribute("d", pathData);
connectionLayer.appendChild(line);

   const runtimeConnection = {
    line: line,
    shape1: shape1,
    shape2: shape2,
    point1: point1,
    point2: point2,
    point1Index: getConnectionPorts(shape1).findIndex(
        port => port.x === point1.x && port.y === point1.y
    ),
    point2Index: getConnectionPorts(shape2).findIndex(
        port => port.x === point2.x && port.y === point2.y
    ),
    controlPoints:
    savedConnection && Array.isArray(savedConnection.controlPoints)
        ? savedConnection.controlPoints.map(function (point) {
            return { ...point };
        })
        : savedConnection && savedConnection.controlPoint
            ? [{ ...savedConnection.controlPoint }]
            : [],

controlPoint:
    savedConnection && savedConnection.controlPoint
        ? { ...savedConnection.controlPoint }
        : null,
    savedData: savedConnection,
    type: "adjustable"
};

connections.push(runtimeConnection);
updateConnections();
if (shouldSave) {
if (!savedConnections[currentTopic]) {
    savedConnections[currentTopic] = [];
}

const newSavedConnection = {
    shape1Id: shape1.savedData.id,
    shape2Id: shape2.savedData.id,
    point1Index: runtimeConnection.point1Index,
    point2Index: runtimeConnection.point2Index
};

savedConnections[currentTopic].push(newSavedConnection);

runtimeConnection.savedData = newSavedConnection;

localStorage.setItem("connections", JSON.stringify(savedConnections));
}
}
function getConnectionPoint(shape, otherShape) {

    const shapeCentreX =
        shape.offsetLeft + shape.offsetWidth / 2;

    const shapeCentreY =
        shape.offsetTop + shape.offsetHeight / 2;

    const otherCentreX =
        otherShape.offsetLeft + otherShape.offsetWidth / 2;

    const otherCentreY =
        otherShape.offsetTop + otherShape.offsetHeight / 2;

    const dx = otherCentreX - shapeCentreX;
    const dy = otherCentreY - shapeCentreY;

    if (Math.abs(dx) > Math.abs(dy)) {

        if (dx > 0) {
            return {
                x: shape.offsetLeft + shape.offsetWidth,
                y: shapeCentreY
            };
        } else {
            return {
                x: shape.offsetLeft,
                y: shapeCentreY
            };
        }

    } else {

        if (dy > 0) {
            return {
                x: shapeCentreX,
                y: shape.offsetTop + shape.offsetHeight
            };
        } else {
            return {
                x: shapeCentreX,
                y: shape.offsetTop
            };
        }

    }
}
function getConnectionPorts(shape) {

    const left = shape.offsetLeft;
    const top = shape.offsetTop;
    const width = shape.offsetWidth;
    const height = shape.offsetHeight;
if (shape.classList.contains("diamond")) {
    return [
        {
            x: left + width / 2,
            y: top,
            side: "top"
        },
        {
            x: left + width,
            y: top + height / 2,
            side: "right"
        },
        {
            x: left + width / 2,
            y: top + height,
            side: "bottom"
        },
        {
            x: left,
            y: top + height / 2,
            side: "left"
        }
    ];
}
    return [
        // Top edge
        {
            x: left + width * 0.25,
            y: top,
            side: "top"
        },
        {
            x: left + width * 0.5,
            y: top,
            side: "top"
        },
        {
            x: left + width * 0.75,
            y: top,
            side: "top"
        },

        // Right edge
        {
            x: left + width,
            y: top + height * 0.25,
            side: "right"
        },
        {
            x: left + width,
            y: top + height * 0.5,
            side: "right"
        },
        {
            x: left + width,
            y: top + height * 0.75,
            side: "right"
        },

        // Bottom edge
        {
            x: left + width * 0.25,
            y: top + height,
            side: "bottom"
        },
        {
            x: left + width * 0.5,
            y: top + height,
            side: "bottom"
        },
        {
            x: left + width * 0.75,
            y: top + height,
            side: "bottom"
        },

        // Left edge
        {
            x: left,
            y: top + height * 0.25,
            side: "left"
        },
        {
            x: left,
            y: top + height * 0.5,
            side: "left"
        },
        {
            x: left,
            y: top + height * 0.75,
            side: "left"
        }
    ];
}
function getBestConnectionPoints(shape1, shape2) {

    const ports1 = getConnectionPorts(shape1);
    const ports2 = getConnectionPorts(shape2);

    let bestPair = null;
    let bestDistance = Infinity;
    const usedPorts1 = connections
    .map(function (connection) {

        if (connection.shape1 === shape1) {
            return connection.point1;
        }

        if (connection.shape2 === shape1) {
            return connection.point2;
        }

        return null;
    })
    .filter(Boolean);

const usedPorts2 = connections
    .map(function (connection) {

        if (connection.shape1 === shape2) {
            return connection.point1;
        }

        if (connection.shape2 === shape2) {
            return connection.point2;
        }

        return null;
    })
    .filter(Boolean);

const availablePorts1 = ports1.filter(function (port) {
    return !usedPorts1.some(function (usedPort) {
        return (
            usedPort.x === port.x &&
            usedPort.y === port.y
        );
    });
});

const availablePorts2 = ports2.filter(function (port) {
    return !usedPorts2.some(function (usedPort) {
        return (
            usedPort.x === port.x &&
            usedPort.y === port.y
        );
    });
});

const candidatePorts1 =
    availablePorts1.length > 0 ? availablePorts1 : ports1;

const candidatePorts2 =
    availablePorts2.length > 0 ? availablePorts2 : ports2;

    candidatePorts1.forEach(function (port1) {

        candidatePorts2.forEach(function (port2) {

            const distance = Math.hypot(
                port2.x - port1.x,
                port2.y - port1.y
            );
            const port1Used = usedPorts1.some(function (usedPort) {
    return (
        usedPort.x === port1.x &&
        usedPort.y === port1.y
    );
});

const port2Used = usedPorts2.some(function (usedPort) {
    return (
        usedPort.x === port2.x &&
        usedPort.y === port2.y
    );
});

const overlapPenalty =
    (port1Used ? 500 : 0) +
    (port2Used ? 500 : 0);

const score = distance + overlapPenalty;

           if (score < bestDistance) {
    bestDistance = score;

                bestPair = {
                    point1: port1,
                    point2: port2
                };
            }
        });
    });

    return bestPair;
}
function isShapeBlocking(shape1, shape2, possibleBlocker) {
    if (possibleBlocker === shape1 || possibleBlocker === shape2) {
        return false;
    }

    const x1 = shape1.offsetLeft + shape1.offsetWidth / 2;
    const y1 = shape1.offsetTop + shape1.offsetHeight / 2;

    const x2 = shape2.offsetLeft + shape2.offsetWidth / 2;
    const y2 = shape2.offsetTop + shape2.offsetHeight / 2;

    const left = possibleBlocker.offsetLeft - 20;
    const right =
        possibleBlocker.offsetLeft +
        possibleBlocker.offsetWidth +
        20;

    const top = possibleBlocker.offsetTop - 20;
    const bottom =
        possibleBlocker.offsetTop +
        possibleBlocker.offsetHeight +
        20;

    const steps = 40;

    for (let i = 0; i <= steps; i++) {
        const t = i / steps;

        const x = x1 + (x2 - x1) * t;
        const y = y1 + (y2 - y1) * t;

        if (
            x >= left &&
            x <= right &&
            y >= top &&
            y <= bottom
        ) {
            return true;
        }
    }

    return false;
}
function doesSegmentCrossConnections(x1, y1, x2, y2, ignoredConnection = null) {

    function linesIntersect(
        ax1, ay1, ax2, ay2,
        bx1, by1, bx2, by2
    ) {

        const denominator =
            (ax1 - ax2) * (by1 - by2) -
            (ay1 - ay2) * (bx1 - bx2);

        if (denominator === 0) {
            return false;
        }

        const t =
            ((ax1 - bx1) * (by1 - by2) -
            (ay1 - by1) * (bx1 - bx2)) /
            denominator;

        const u =
            -(
                (ax1 - ax2) * (ay1 - by1) -
                (ay1 - ay2) * (ax1 - bx1)
            ) /
            denominator;

        return t > 0 && t < 1 && u > 0 && u < 1;
    }

    for (const connection of connections) {
        if (connection === ignoredConnection) {
    continue;
}

        const path = connection.line;

        if (!path) {
            continue;
        }

        const totalLength = path.getTotalLength();
        const steps = 30;

        let previousPoint = path.getPointAtLength(0);

        for (let i = 1; i <= steps; i++) {

            const currentPoint = path.getPointAtLength(
                totalLength * (i / steps)
            );

            if (
                linesIntersect(
                    x1,
                    y1,
                    x2,
                    y2,
                    previousPoint.x,
                    previousPoint.y,
                    currentPoint.x,
                    currentPoint.y
                )
            ) {
                return true;
            }

            previousPoint = currentPoint;
        }
    }

    return false;
}
function isPathClear(points, shape1, shape2) {

    const allShapes = Array.from(
        canvas.querySelectorAll(".shape")
    );

    function segmentHitsRectangle(
        x1,
        y1,
        x2,
        y2,
        left,
        top,
        right,
        bottom
    ) {

        const dx = x2 - x1;
        const dy = y2 - y1;

        let t0 = 0;
        let t1 = 1;

        const checks = [
            [-dx, x1 - left],
            [dx, right - x1],
            [-dy, y1 - top],
            [dy, bottom - y1]
        ];

        for (const check of checks) {

            const p = check[0];
            const q = check[1];

            if (p === 0) {

                if (q < 0) {
                    return false;
                }

            } else {

                const r = q / p;

                if (p < 0) {

                    if (r > t1) {
                        return false;
                    }

                    if (r > t0) {
                        t0 = r;
                    }

                } else {

                    if (r < t0) {
                        return false;
                    }

                    if (r < t1) {
                        t1 = r;
                    }
                }
            }
        }

        return true;
    }

    for (let i = 0; i < points.length - 1; i++) {

        const start = points[i];
        const end = points[i + 1];

        for (const shape of allShapes) {

            if (
                shape === shape1 ||
                shape === shape2
            ) {
                continue;
            }

            const padding = 20;

            const left =
                shape.offsetLeft - padding;

            const right =
                shape.offsetLeft +
                shape.offsetWidth +
                padding;

            const top =
                shape.offsetTop - padding;

            const bottom =
                shape.offsetTop +
                shape.offsetHeight +
                padding;

            if (
                segmentHitsRectangle(
                    start.x,
                    start.y,
                    end.x,
                    end.y,
                    left,
                    top,
                    right,
                    bottom
                )
            ) {
                return false;
            }
        }
    }

    return true;
}
function getSmartPath(
    shape1,
    shape2,
    x1,
    y1,
    x2,
    y2,
    currentConnection = null
) {
    return `M ${x1} ${y1} L ${x2} ${y2}`;

    const start = { x: x1, y: y1 };
    const end = { x: x2, y: y2 };

    // If the direct connection is clear, use it.
    if (isPathClear([start, end], shape1, shape2)) {
        return `M ${x1} ${y1} L ${x2} ${y2}`;
    }

    const otherShapes = Array.from(
        canvas.querySelectorAll(".shape")
    ).filter(function (shape) {
        return shape !== shape1 && shape !== shape2;
    });

    const clearance = 30;

    const xValues = [x1, x2];
    const yValues = [y1, y2];

    otherShapes.forEach(function (shape) {

        xValues.push(
            shape.offsetLeft - clearance
        );

        xValues.push(
            shape.offsetLeft +
            shape.offsetWidth +
            clearance
        );

        yValues.push(
            shape.offsetTop - clearance
        );

        yValues.push(
            shape.offsetTop +
            shape.offsetHeight +
            clearance
        );
    });

    const uniqueX = [...new Set(xValues)];
    const uniqueY = [...new Set(yValues)];

    const nodes = [];

    function pointInsideObstacle(x, y) {

        return otherShapes.some(function (shape) {

            const left =
                shape.offsetLeft - 20;

            const right =
                shape.offsetLeft +
                shape.offsetWidth +
                20;

            const top =
                shape.offsetTop - 20;

            const bottom =
                shape.offsetTop +
                shape.offsetHeight +
                20;

            return (
                x > left &&
                x < right &&
                y > top &&
                y < bottom
            );
        });
    }

    uniqueX.forEach(function (x) {

        uniqueY.forEach(function (y) {

            if (!pointInsideObstacle(x, y)) {
                nodes.push({
                    x: x,
                    y: y,
                    neighbours: []
                });
            }
        });
    });

    function findNode(x, y) {

        return nodes.find(function (node) {
            return node.x === x && node.y === y;
        });
    }

    const startNode = findNode(x1, y1);
    const endNode = findNode(x2, y2);

    if (!startNode || !endNode) {
        return "";
    }

    // Join neighbouring points horizontally.
    uniqueY.forEach(function (y) {

        const row = nodes
            .filter(function (node) {
                return node.y === y;
            })
            .sort(function (a, b) {
                return a.x - b.x;
            });

        for (let i = 0; i < row.length - 1; i++) {

            const a = row[i];
            const b = row[i + 1];

            if (isPathClear([a, b], shape1, shape2)) {

                const distance =
                    Math.abs(b.x - a.x);

                a.neighbours.push({
                    node: b,
                    distance: distance
                });

                b.neighbours.push({
                    node: a,
                    distance: distance
                });
            }
        }
    });

    // Join neighbouring points vertically.
    uniqueX.forEach(function (x) {

        const column = nodes
            .filter(function (node) {
                return node.x === x;
            })
            .sort(function (a, b) {
                return a.y - b.y;
            });

        for (let i = 0; i < column.length - 1; i++) {

            const a = column[i];
            const b = column[i + 1];

           if (isPathClear([a, b], shape1, shape2)) {

                const distance =
                    Math.abs(b.y - a.y);

                a.neighbours.push({
                    node: b,
                    distance: distance
                });

                b.neighbours.push({
                    node: a,
                    distance: distance
                });
            }
        }
    });

    // Find the shortest clear route.
    const distances = new Map();
    const previous = new Map();
    const unvisited = new Set(nodes);

    nodes.forEach(function (node) {
        distances.set(node, Infinity);
    });

    distances.set(startNode, 0);

    while (unvisited.size > 0) {

        let current = null;
        let smallestDistance = Infinity;

        unvisited.forEach(function (node) {

            const distance =
                distances.get(node);

            if (distance < smallestDistance) {
                smallestDistance = distance;
                current = node;
            }
        });

        if (!current) {
            break;
        }

        if (current === endNode) {
            break;
        }

        unvisited.delete(current);

        current.neighbours.forEach(function (connection) {

            if (!unvisited.has(connection.node)) {
                return;
            }

            const newDistance =
                distances.get(current) +
                connection.distance +
                0.1;

            if (
                newDistance <
                distances.get(connection.node)
            ) {
                distances.set(
                    connection.node,
                    newDistance
                );

                previous.set(
                    connection.node,
                    current
                );
            }
        });
    }

    if (
        distances.get(endNode) === Infinity
    ) {
        return "";
    }

    const route = [];

    let current = endNode;

    while (current) {

        route.unshift({
            x: current.x,
            y: current.y
        });

        current = previous.get(current);
    }

    // Remove unnecessary points on straight sections.
    const simplified = [];

    route.forEach(function (point, index) {

        if (
            index === 0 ||
            index === route.length - 1
        ) {
            simplified.push(point);
            return;
        }

        const previousPoint =
            route[index - 1];

        const nextPoint =
            route[index + 1];

        const sameHorizontal =
            previousPoint.y === point.y &&
            point.y === nextPoint.y;

        const sameVertical =
            previousPoint.x === point.x &&
            point.x === nextPoint.x;

        if (!sameHorizontal && !sameVertical) {
            simplified.push(point);
        }
    });

    // Create rounded corners.
    const curve = 20;

    let path =
        `M ${simplified[0].x} ${simplified[0].y}`;

    for (
        let i = 1;
        i < simplified.length - 1;
        i++
    ) {

        const previousPoint =
            simplified[i - 1];

        const currentPoint =
            simplified[i];

        const nextPoint =
            simplified[i + 1];

        const incomingX =
            currentPoint.x -
            previousPoint.x;

        const incomingY =
            currentPoint.y -
            previousPoint.y;

        const outgoingX =
            nextPoint.x -
            currentPoint.x;

        const outgoingY =
            nextPoint.y -
            currentPoint.y;

        const incomingLength =
            Math.abs(incomingX) +
            Math.abs(incomingY);

        const outgoingLength =
            Math.abs(outgoingX) +
            Math.abs(outgoingY);

        const cornerSize = Math.min(
            curve,
            incomingLength / 2,
            outgoingLength / 2
        );

        const beforeX =
            currentPoint.x -
            Math.sign(incomingX) *
            cornerSize;

        const beforeY =
            currentPoint.y -
            Math.sign(incomingY) *
            cornerSize;

        const afterX =
            currentPoint.x +
            Math.sign(outgoingX) *
            cornerSize;

        const afterY =
            currentPoint.y +
            Math.sign(outgoingY) *
            cornerSize;

        path +=
            ` L ${beforeX} ${beforeY}`;

        path +=
            ` Q ${currentPoint.x} ${currentPoint.y}` +
            ` ${afterX} ${afterY}`;
    }

    const last =
        simplified[simplified.length - 1];

    path +=
        ` L ${last.x} ${last.y}`;

    return path;
}
function buildCurvePath(startX, startY, endX, endY, controlPoints) {

    const points = [
        { x: startX, y: startY },
        ...controlPoints,
        { x: endX, y: endY }
    ];

    if (points.length === 2) {
        return `M ${startX} ${startY} L ${endX} ${endY}`;
    }

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {

        const p0 = points[i - 1] || points[i];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2] || p2;

        const control1X =
            p1.x + (p2.x - p0.x) / 6;

        const control1Y =
            p1.y + (p2.y - p0.y) / 6;

        const control2X =
            p2.x - (p3.x - p1.x) / 6;

        const control2Y =
            p2.y - (p3.y - p1.y) / 6;

        path +=
            ` C ${control1X} ${control1Y}` +
            ` ${control2X} ${control2Y}` +
            ` ${p2.x} ${p2.y}`;
    }

    return path;
}
function updateConnections() {

    connections.forEach(function (connection) {
        if (connection.type === "freeLine") {

    const saved = connection.savedData;

    if (saved.shape1Id != null) {
        const shape1 = Array.from(
            canvas.querySelectorAll(".shape")
        ).find(function (shape) {
            return shape.savedData.id === saved.shape1Id;
        });

        if (shape1) {
            const ports = getConnectionPorts(shape1);
            const point = ports[saved.point1Index];

            if (point) {
                saved.x1 = point.x;
                saved.y1 = point.y;
            }
        }
    }

    if (saved.shape2Id != null) {
        const shape2 = Array.from(
            canvas.querySelectorAll(".shape")
        ).find(function (shape) {
            return shape.savedData.id === saved.shape2Id;
        });

        if (shape2) {
            const ports = getConnectionPorts(shape2);
            const point = ports[saved.point2Index];

            if (point) {
                saved.x2 = point.x;
                saved.y2 = point.y;
            }
        }
    }

    const controlPoints =
    Array.isArray(saved.controlPoints)
        ? saved.controlPoints
        : [];

connection.controlPoints = controlPoints;

connection.line.setAttribute(
    "d",
    buildCurvePath(
        saved.x1,
        saved.y1,
        saved.x2,
        saved.y2,
        controlPoints
    )
);
if (selectedConnection === connection.line) {

    if (startHandle) {
        startHandle.setAttribute("cx", saved.x1);
        startHandle.setAttribute("cy", saved.y1);
    }

    if (endHandle) {
        endHandle.setAttribute("cx", saved.x2);
        endHandle.setAttribute("cy", saved.y2);
    }
}
    return;
}

        const shape1 = connection.shape1;
        const shape2 = connection.shape2;
        const line = connection.line;

       const ports1 = getConnectionPorts(shape1);
const ports2 = getConnectionPorts(shape2);

const point1 = ports1[connection.point1Index];
const point2 = ports2[connection.point2Index];
connection.point1 = point1;
connection.point2 = point2;

const x1 = point1.x;
const y1 = point1.y;

const x2 = point2.x;
const y2 = point2.y;
connection.controlPoints.forEach(function (point) {

    if (point.followsLine) {

        point.x = (x1 + x2) / 2 + point.offsetX;
        point.y = (y1 + y2) / 2 + point.offsetY;
    }
});
connection.controlPoints.forEach(function (point) {

    if (
        point.followsConnection &&
        point.positionRatio !== undefined
    ) {

        point.x =
            x1 + (x2 - x1) * point.positionRatio + point.offsetX;

        point.y =
            y1 + (y2 - y1) * point.positionRatio + point.offsetY;
    }
});

        let pathData;
if (
    connection.controlPoint &&
    connection.controlPoint.offsetX !== undefined
) {

    const middleX =
        (connection.point1.x + connection.point2.x) / 2;

    const middleY =
        (connection.point1.y + connection.point2.y) / 2;

    connection.controlPoint.x =
        middleX + connection.controlPoint.offsetX;

    connection.controlPoint.y =
        middleY + connection.controlPoint.offsetY;
}
pathData = buildCurvePath(
    x1,
    y1,
    x2,
    y2,
    connection.controlPoints
);
line.setAttribute("d", pathData);
if (selectedConnection === line) {

    if (connectionHandle) {

    if (connection.controlPoints.length > 0) {

    connectionHandle.setAttribute(
        "cx",
        connection.controlPoints[0].x
    );

    connectionHandle.setAttribute(
        "cy",
        connection.controlPoints[0].y
    );

} else {

    const totalLength = line.getTotalLength();
    const middlePoint =
        line.getPointAtLength(totalLength / 2);

    connectionHandle.setAttribute(
        "cx",
        middlePoint.x
    );

    connectionHandle.setAttribute(
        "cy",
        middlePoint.y
    );
}
}

    if (startHandle) {
        startHandle.setAttribute("cx", connection.point1.x);
        startHandle.setAttribute("cy", connection.point1.y);
    }

    if (endHandle) {
        endHandle.setAttribute("cx", connection.point2.x);
        endHandle.setAttribute("cy", connection.point2.y);
    }
   
}
    });
     if (
    selectedShape &&
    selectedShape.classList.contains("diamond") &&
    shapeSelectionOutline
) {
    const gap = 4;

    const left = selectedShape.offsetLeft - gap;
    const top = selectedShape.offsetTop - gap;
    const width = selectedShape.offsetWidth + gap * 2;
    const height = selectedShape.offsetHeight + gap * 2;

    shapeSelectionOutline.setAttribute(
        "points",
        `${left + width / 2},${top} ` +
        `${left + width},${top + height / 2} ` +
        `${left + width / 2},${top + height} ` +
        `${left},${top + height / 2}`
    );
}
}
displayTopics();
if (currentTopic) {
    openTopic(currentTopic);
}

function findNearestSnapPort(x, y) {

    let nearest = null;
    let nearestDistance = Infinity;

    const allShapes = Array.from(
    canvas.querySelectorAll(".shape:not(.textbox)")
);

    allShapes.forEach(function (shape) {

        const ports = getConnectionPorts(shape);

        ports.forEach(function (port, index) {

            const distance = Math.hypot(
                x - port.x,
                y - port.y
            );

            if (distance < nearestDistance) {

                nearestDistance = distance;

                nearest = {
                    shape: shape,
                    port: port,
                    portIndex: index,
                    distance: distance
                };
            }
        });
    });

    return nearest;
}
function showConnectionHandle(line) {

    if (connectionHandle) {
        connectionHandle.remove();
    }
connectionHandles.forEach(function (handle) {
    handle.remove();
});

connectionHandles = [];
    if (startHandle) {
        startHandle.remove();
    }

    if (endHandle) {
        endHandle.remove();
    }

    const connection = connections.find(function (item) {
        return item.line === line;
    });

    if (!connection) {
        return;
    }

    const connectionLayer =
        document.getElementById("connectionLayer");

    // BLUE CONTROL HANDLE
    connectionHandle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
    );

    let controlX;
    let controlY;

    if (connection.controlPoints.length > 0) {
    controlX = connection.controlPoints[0].x;
    controlY = connection.controlPoints[0].y;
    } else {
        const totalLength = line.getTotalLength();
        const middlePoint =
            line.getPointAtLength(totalLength / 2);

        controlX = middlePoint.x;
        controlY = middlePoint.y;
    }

    connectionHandle.setAttribute("cx", controlX);
    connectionHandle.setAttribute("cy", controlY);
    connectionHandle.setAttribute("r", "8");
    connectionHandle.setAttribute("fill", "#2563eb");

    connectionHandle.style.pointerEvents = "all";
    connectionHandle.style.cursor = "move";
    connectionHandle.addEventListener("click", function (event) {

    event.stopPropagation();

    if (selectedControlPointHandle === connectionHandle) {
        connectionHandle.removeAttribute("stroke");
        connectionHandle.removeAttribute("stroke-width");

        selectedControlPointHandle = null;
        selectedControlPointIndex = null;

        return;
    }

    if (selectedControlPointHandle) {
        selectedControlPointHandle.removeAttribute("stroke");
        selectedControlPointHandle.removeAttribute("stroke-width");
    }

    selectedConnectionData = connection;
    selectedControlPointIndex = 0;
    selectedControlPointHandle = connectionHandle;

    connectionHandle.setAttribute("stroke", "#111827");
    connectionHandle.setAttribute("stroke-width", "3");
});

    connectionLayer.appendChild(connectionHandle);
    connectionHandles.push(connectionHandle);
   connection.controlPoints.forEach(function (point, index) {

    if (index === 0) {
        return;
    }

    const extraHandle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
    );

    extraHandle.setAttribute("cx", point.x);
    extraHandle.setAttribute("cy", point.y);
    extraHandle.setAttribute("r", 8);
    extraHandle.setAttribute("fill", "#2563eb");
    extraHandle.style.pointerEvents = "all";
extraHandle.style.cursor = "move";
extraHandle.addEventListener("click", function (event) {

    event.stopPropagation();

    if (selectedControlPointHandle === extraHandle) {
        extraHandle.removeAttribute("stroke");
        extraHandle.removeAttribute("stroke-width");

        selectedControlPointHandle = null;
        selectedControlPointIndex = null;

        return;
    }

    if (selectedControlPointHandle) {
        selectedControlPointHandle.removeAttribute("stroke");
        selectedControlPointHandle.removeAttribute("stroke-width");
    }

    selectedConnectionData = connection;
    selectedControlPointIndex = index;
    selectedControlPointHandle = extraHandle;

    extraHandle.setAttribute("stroke", "#111827");
    extraHandle.setAttribute("stroke-width", "3");
});

    connectionLayer.appendChild(extraHandle);
    connectionHandles.push(extraHandle);
    extraHandle.addEventListener("pointerdown", function (event) {

    event.stopPropagation();

    extraHandle.setPointerCapture(event.pointerId);

    function moveExtraHandle(event) {

        const canvasRect = canvas.getBoundingClientRect();

        const x =
    (event.clientX - canvasRect.left) / canvasZoom;

const y =
    (event.clientY - canvasRect.top) / canvasZoom;

        connection.controlPoints[index].x = x;
        connection.controlPoints[index].y = y;
        const point = connection.controlPoints[index];

const baseX =
    connection.point1.x +
    (connection.point2.x - connection.point1.x) *
    point.positionRatio;

const baseY =
    connection.point1.y +
    (connection.point2.y - connection.point1.y) *
    point.positionRatio;

point.offsetX = x - baseX;
point.offsetY = y - baseY;

        extraHandle.setAttribute("cx", x);
        extraHandle.setAttribute("cy", y);

        updateConnections();
    }

    function stopExtraHandle(event) {

        if (connection.savedData) {
            connection.savedData.controlPoints =
                connection.controlPoints.map(function (point) {
                    return { ...point };
                });

            localStorage.setItem(
                "connections",
                JSON.stringify(savedConnections)
            );
        }

        extraHandle.releasePointerCapture(event.pointerId);

        extraHandle.removeEventListener(
            "pointermove",
            moveExtraHandle
        );

        extraHandle.removeEventListener(
            "pointerup",
            stopExtraHandle
        );
    }

    extraHandle.addEventListener(
        "pointermove",
        moveExtraHandle
    );

    extraHandle.addEventListener(
        "pointerup",
        stopExtraHandle
    );
});
});

    // START BLACK HANDLE
    startHandle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
    );

    startHandle.setAttribute(
        "cx",
        connection.point1.x
    );

    startHandle.setAttribute(
        "cy",
        connection.point1.y
    );

    startHandle.setAttribute("r", "7");
    startHandle.setAttribute("fill", "#111827");
    startHandle.style.pointerEvents = "all";
    startHandle.style.cursor = "move";

    connectionLayer.appendChild(startHandle);
    startHandle.addEventListener("click", function (event) {

    event.stopPropagation();

    if (selectedEndpoint === "start") {
        startHandle.removeAttribute("stroke");
        startHandle.removeAttribute("stroke-width");
        selectedEndpoint = null;
        return;
    }

    if (endHandle) {
        endHandle.removeAttribute("stroke");
        endHandle.removeAttribute("stroke-width");
    }

    selectedEndpoint = "start";

    startHandle.setAttribute("stroke", "#2563eb");
    startHandle.setAttribute("stroke-width", "4");
});

    // END BLACK HANDLE
    endHandle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
    );

    endHandle.setAttribute(
        "cx",
        connection.point2.x
    );

    endHandle.setAttribute(
        "cy",
        connection.point2.y
    );

    endHandle.setAttribute("r", "7");
    endHandle.setAttribute("fill", "#111827");
    endHandle.style.pointerEvents = "all";
    endHandle.style.cursor = "move";

    connectionLayer.appendChild(endHandle);
    endHandle.addEventListener("click", function (event) {

    event.stopPropagation();

    if (selectedEndpoint === "end") {
        endHandle.removeAttribute("stroke");
        endHandle.removeAttribute("stroke-width");
        selectedEndpoint = null;
        return;
    }

    if (startHandle) {
        startHandle.removeAttribute("stroke");
        startHandle.removeAttribute("stroke-width");
    }

    selectedEndpoint = "end";

    endHandle.setAttribute("stroke", "#2563eb");
    endHandle.setAttribute("stroke-width", "4");
});

    function redrawPreview(startX, startY, endX, endY) {

    const pathData = buildCurvePath(
        startX,
        startY,
        endX,
        endY,
        connection.controlPoints
    );

    line.setAttribute("d", pathData);
}

    // BLUE HANDLE DRAG
    connectionHandle.addEventListener(
        "pointerdown",
        function (event) {

            event.stopPropagation();

            connectionHandle.setPointerCapture(
                event.pointerId
            );

            function moveControl(event) {

                const canvasRect =
                    canvas.getBoundingClientRect();

            const x =
    (event.clientX - canvasRect.left) / canvasZoom;

const y =
    (event.clientY - canvasRect.top) / canvasZoom;

                const middleX =
    (connection.point1.x + connection.point2.x) / 2;

const middleY =
    (connection.point1.y + connection.point2.y) / 2;

connection.controlPoint = {
    x: x,
    y: y,
    offsetX: x - middleX,
    offsetY: y - middleY
};
connection.controlPoints[0] = {
    x: x,
    y: y,
    offsetX: x - middleX,
    offsetY: y - middleY,
    followsLine: true
};

                connectionHandle.setAttribute("cx", x);
                connectionHandle.setAttribute("cy", y);

                redrawPreview(
                    connection.point1.x,
                    connection.point1.y,
                    connection.point2.x,
                    connection.point2.y
                );
            }

            function stopControl(event) {
                const savedConnection =
    connection.savedData;

if (savedConnection && connection.controlPoint) {

    savedConnection.controlPoint = {
        x: connection.controlPoint.x,
        y: connection.controlPoint.y,
        offsetX: connection.controlPoint.offsetX,
        offsetY: connection.controlPoint.offsetY
    };
savedConnection.controlPoints =
    connection.controlPoints.map(function (point) {
        return { ...point };
    });
    localStorage.setItem(
        "connections",
        JSON.stringify(savedConnections)
    );
}

                connectionHandle.releasePointerCapture(
                    event.pointerId
                );

                connectionHandle.removeEventListener(
                    "pointermove",
                    moveControl
                );

                connectionHandle.removeEventListener(
                    "pointerup",
                    stopControl
                );
            }

            connectionHandle.addEventListener(
                "pointermove",
                moveControl
            );

            connectionHandle.addEventListener(
                "pointerup",
                stopControl
            );
        }
    );

    // END HANDLE DRAG
    endHandle.addEventListener(
        "pointerdown",
        function (event) {

            event.stopPropagation();

            endHandle.setPointerCapture(
                event.pointerId
            );

            function moveEnd(event) {

                const canvasRect =
                    canvas.getBoundingClientRect();

              const x =
    (event.clientX - canvasRect.left) / canvasZoom;

const y =
    (event.clientY - canvasRect.top) / canvasZoom;

                const nearest =
                    findNearestSnapPort(x, y);

                let endX = x;
                let endY = y;

                if (
                    nearest &&
                    nearest.distance <= 30
                ) {
                    endX = nearest.port.x;
                    endY = nearest.port.y;
                }

                endHandle.setAttribute("cx", endX);
                endHandle.setAttribute("cy", endY);

                redrawPreview(
                    connection.point1.x,
                    connection.point1.y,
                    endX,
                    endY
                );
            }

            function stopEnd(event) {

                const endX =
                    Number(
                        endHandle.getAttribute("cx")
                    );

                const endY =
                    Number(
                        endHandle.getAttribute("cy")
                    );

                const nearest =
                    findNearestSnapPort(
                        endX,
                        endY
                    );

                if (
                    nearest &&
                    nearest.distance <= 30
                ) {
const oldShape2Id =
    connection.shape2.savedData.id;
                    connection.shape2 =
                        nearest.shape;

                    connection.point2Index =
                        nearest.portIndex;

                    connection.point2 =
                        nearest.port;
                        const savedConnection =
    connection.savedData;

if (savedConnection) {
    savedConnection.shape2Id =
        connection.shape2.savedData.id;

    savedConnection.point2Index =
        connection.point2Index;

    localStorage.setItem(
        "connections",
        JSON.stringify(savedConnections)
    );
}
                }

                updateConnections();

                endHandle.releasePointerCapture(
                    event.pointerId
                );

                endHandle.removeEventListener(
                    "pointermove",
                    moveEnd
                );

                endHandle.removeEventListener(
                    "pointerup",
                    stopEnd
                );
            }

            endHandle.addEventListener(
                "pointermove",
                moveEnd
            );

            endHandle.addEventListener(
                "pointerup",
                stopEnd
            );
        }
    );

    // START HANDLE DRAG
    startHandle.addEventListener(
        "pointerdown",
        function (event) {

            event.stopPropagation();

            startHandle.setPointerCapture(
                event.pointerId
            );

            function moveStart(event) {

                const canvasRect =
                    canvas.getBoundingClientRect();

                const x =
    (event.clientX - canvasRect.left) / canvasZoom;

const y =
    (event.clientY - canvasRect.top) / canvasZoom;

                const nearest =
                    findNearestSnapPort(x, y);

                let startX = x;
                let startY = y;

                if (
                    nearest &&
                    nearest.distance <= 30
                ) {
                    startX = nearest.port.x;
                    startY = nearest.port.y;
                }

                startHandle.setAttribute(
                    "cx",
                    startX
                );

                startHandle.setAttribute(
                    "cy",
                    startY
                );

                redrawPreview(
                    startX,
                    startY,
                    connection.point2.x,
                    connection.point2.y
                );
            }

            function stopStart(event) {

                const startX =
                    Number(
                        startHandle.getAttribute("cx")
                    );

                const startY =
                    Number(
                        startHandle.getAttribute("cy")
                    );

                const nearest =
                    findNearestSnapPort(
                        startX,
                        startY
                    );

                if (
                    nearest &&
                    nearest.distance <= 30
                ) {

                    connection.shape1 =
                        nearest.shape;

                    connection.point1Index =
                        nearest.portIndex;

                    connection.point1 =
                        nearest.port;
                        const savedConnection =
    connection.savedData;

if (savedConnection) {

    savedConnection.shape1Id =
        connection.shape1.savedData.id;

    savedConnection.point1Index =
        connection.point1Index;

    localStorage.setItem(
        "connections",
        JSON.stringify(savedConnections)
    );
}
                }

                updateConnections();

                startHandle.releasePointerCapture(
                    event.pointerId
                );

                startHandle.removeEventListener(
                    "pointermove",
                    moveStart
                );

                startHandle.removeEventListener(
                    "pointerup",
                    stopStart
                );
            }

            startHandle.addEventListener(
                "pointermove",
                moveStart
            );

            startHandle.addEventListener(
                "pointerup",
                stopStart
            );
        }
    );
}
document.addEventListener("keydown", function (event) {

        if (
        (event.key === "Delete" || event.key === "Backspace") &&
        selectedConnectionData &&
        selectedControlPointIndex !== null
    ) {
        event.preventDefault();

        selectedConnectionData.controlPoints.splice(
            selectedControlPointIndex,
            1
        );

        if (selectedConnectionData.savedData) {
            selectedConnectionData.savedData.controlPoints =
                selectedConnectionData.controlPoints.map(function (point) {
                    return { ...point };
                });

            localStorage.setItem(
                "connections",
                JSON.stringify(savedConnections)
            );
        }

        selectedControlPointIndex = null;

        updateConnections();
        showConnectionHandle(selectedConnectionData.line);

        return;
    }

    if (
        (event.key === "Delete" || event.key === "Backspace") &&
        selectedConnectionData
    ) {
        event.preventDefault();

        const savedConnection = selectedConnectionData.savedData;

        if (savedConnection && savedConnections[currentTopic]) {
            savedConnections[currentTopic] =
                savedConnections[currentTopic].filter(function (item) {
                    return item !== savedConnection;
                });

            localStorage.setItem(
                "connections",
                JSON.stringify(savedConnections)
            );
        }

        selectedConnectionData.line.remove();

        connections = connections.filter(function (item) {
            return item !== selectedConnectionData;
        });

        connectionHandles.forEach(function (handle) {
            handle.remove();
        });

        connectionHandles = [];

        if (startHandle) {
            startHandle.remove();
            startHandle = null;
        }

        if (endHandle) {
            endHandle.remove();
            endHandle = null;
        }

        selectedConnection = null;
        selectedConnectionData = null;
    }
});
arrowEndBtn.addEventListener("click", function () {

    if (!selectedConnection || !selectedConnectionData) {
        alert("Select a connection first.");
        return;
    }

    if (!selectedEndpoint) {
        alert("Select one of the black endpoint dots first.");
        return;
    }

    if (selectedEndpoint === "start") {

        const hasArrow =
            selectedConnection.getAttribute("marker-start") ===
            "url(#arrowhead)";

        if (hasArrow) {
            selectedConnection.removeAttribute("marker-start");
        } else {
            selectedConnection.setAttribute(
                "marker-start",
                "url(#arrowhead)"
            );
        }
        if (selectedConnectionData.savedData) {
    selectedConnectionData.savedData.arrowStart = !hasArrow;

    localStorage.setItem(
        "connections",
        JSON.stringify(savedConnections)
    );
}
    }

   if (selectedEndpoint === "end") {

    const hasArrow =
        selectedConnection.getAttribute("marker-end") ===
        "url(#arrowhead)";

    if (hasArrow) {
        selectedConnection.removeAttribute("marker-end");
    } else {
        selectedConnection.setAttribute(
            "marker-end",
            "url(#arrowhead)"
        );
    }

    if (selectedConnectionData.savedData) {
        selectedConnectionData.savedData.arrowEnd = !hasArrow;

        localStorage.setItem(
            "connections",
            JSON.stringify(savedConnections)
        );
    }
}
});
canvasSizeSelect.addEventListener("change", function () {
    localStorage.setItem(
    "canvasSizeMode",
    canvasSizeSelect.value
);

    if (canvasSizeSelect.value === "a4-portrait") {
        canvas.style.width = "794px";
        canvas.style.height = "1123px";
        localStorage.setItem("canvasWidth", "794");
localStorage.setItem("canvasHeight", "1123");
    }

    if (canvasSizeSelect.value === "a4-landscape") {
        canvas.style.width = "1123px";
        canvas.style.height = "794px";

         localStorage.setItem("canvasWidth", "1123");
    localStorage.setItem("canvasHeight", "794");
    }

});
canvas.addEventListener("pointerdown", function (event) {

    const resizeHandle = event.target.closest("#canvasResizeHandle");

    if (!resizeHandle) {
        return;
    }

    event.preventDefault();

    const canvasSizeLabel =
        resizeHandle.querySelector("#canvasSizeLabel");

    const startX = event.clientX;
    const startY = event.clientY;

    const startWidth = canvas.offsetWidth;
    const startHeight = canvas.offsetHeight;
    const canvasViewport =
    document.getElementById("canvasViewport");

const startScrollLeft =
    canvasViewport ? canvasViewport.scrollLeft : 0;
    let lastPointerX = startX;
let lastPointerY = startY;
let autoGrowFrame = null;

    function resizeCanvas(moveEvent) {
        lastPointerX = moveEvent.clientX;
lastPointerY = moveEvent.clientY;

        canvasSizeSelect.value = "custom";

        localStorage.setItem(
            "canvasSizeMode",
            "custom"
        );

      

const scrollDifference =
    canvasViewport
        ? canvasViewport.scrollLeft - startScrollLeft
        : 0;

const newWidth = Math.max(
    300,
    startWidth +
    (moveEvent.clientX - startX) +
    scrollDifference
);

        const newHeight = Math.max(
            300,
            startHeight + (moveEvent.clientY - startY)
        );

        canvas.style.width = newWidth + "px";
        canvas.style.height = newHeight + "px";

        if (canvasSizeLabel) {
            canvasSizeLabel.textContent =
                Math.round(newWidth) +
                " × " +
                Math.round(newHeight) +
                " px";

            canvasSizeLabel.style.display = "block";
        }
    }
function autoGrowCanvas() {

    if (
        canvasViewport &&
        lastPointerX >= window.innerWidth - 50
    ) {
        const currentWidth =
            parseFloat(
                window.getComputedStyle(canvas).width
            );

        const growBy = 5;

        canvas.style.width =
            (currentWidth + growBy) + "px";

        canvasViewport.scrollLeft += growBy;

        if (canvasSizeLabel) {
            canvasSizeLabel.textContent =
                Math.round(canvas.offsetWidth) +
                " × " +
                Math.round(canvas.offsetHeight) +
                " px";
        }

        updateConnections();
    }

    autoGrowFrame =
        requestAnimationFrame(autoGrowCanvas);
}

autoGrowFrame =
    requestAnimationFrame(autoGrowCanvas);
    function stopResize() {
        if (autoGrowFrame) {
    cancelAnimationFrame(autoGrowFrame);
    autoGrowFrame = null;
}

        if (canvasSizeLabel) {
            canvasSizeLabel.style.display = "none";
        }

        localStorage.setItem(
            "canvasWidth",
            canvas.offsetWidth
        );

        localStorage.setItem(
            "canvasHeight",
            canvas.offsetHeight
        );

        window.removeEventListener(
            "pointermove",
            resizeCanvas
        );

        window.removeEventListener(
            "pointerup",
            stopResize
        );
    }

    window.addEventListener(
        "pointermove",
        resizeCanvas
    );

    window.addEventListener(
        "pointerup",
        stopResize
    );
});
const canvasToolbar = document.getElementById("canvasToolbar");
const canvasWorkspace = document.getElementById("canvasWorkspace");

function updateToolbarPosition() {

    if (!canvasToolbar || !canvasWorkspace) {
        return;
    }

    const topicIsVisible =
        window.getComputedStyle(topicPage).display !== "none";

    if (!topicIsVisible) {
        canvasToolbar.classList.remove("toolbar-fixed");
        return;
    }

    const workspaceTop =
        canvasWorkspace.getBoundingClientRect().top;

    if (workspaceTop <= 12) {
        canvasToolbar.classList.add("toolbar-fixed");
    } else {
        canvasToolbar.classList.remove("toolbar-fixed");
    }
}

window.addEventListener("scroll", updateToolbarPosition, {
    passive: true
});

window.addEventListener("resize", updateToolbarPosition);
console.log("Supabase connected:", supabaseClient);
const loginBtn = document.getElementById("loginBtn");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const logoutBtn = document.getElementById("logoutBtn");
const loginStatus = document.getElementById("loginStatus");
async function updateLoginStatus() {

    const {
        data: { user }
    } = await supabaseClient.auth.getUser();

    if (user) {
        loginStatus.textContent =
            "Signed in as: " + user.email;
    } else {
        loginStatus.textContent =
            "Not signed in";
    }
}

updateLoginStatus();
async function saveUserDataToCloud() {

    const {
        data: { user },
        error: userError
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
        return;
    }

    const appData = {
        topics: topics,
        shapes: shapes,
        connections: savedConnections,
        currentTopic: currentTopic,
        canvasWidth: localStorage.getItem("canvasWidth"),
        canvasHeight: localStorage.getItem("canvasHeight"),
        canvasSizeMode: localStorage.getItem("canvasSizeMode")
    };

    const { error } = await supabaseClient
        .from("user_mind_map_data")
        .upsert({
            user_id: user.id,
            data: appData,
            updated_at: new Date().toISOString()
        });

    if (error) {
        console.error("Cloud save failed:", error);
        return;
    }

    console.log("Cloud save successful");
}
let cloudSaveTimer;

function scheduleCloudSave() {

    clearTimeout(cloudSaveTimer);

    cloudSaveTimer = setTimeout(function () {
        saveUserDataToCloud();
    }, 800);
}
const cloudSaveKeys = [
    "topics",
    "shapes",
    "connections",
    "currentTopic",
    "canvasWidth",
    "canvasHeight",
    "canvasSizeMode"
];

const originalSetItem =
    Storage.prototype.setItem;

Storage.prototype.setItem = function (key, value) {

    originalSetItem.call(this, key, value);

    if (
        this === localStorage &&
        cloudSaveKeys.includes(key)
    ) {
        scheduleCloudSave();
    }
};
async function loadUserDataFromCloud() {

    const {
        data: { user },
        error: userError
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
        return null;
    }

    const { data, error } = await supabaseClient
        .from("user_mind_map_data")
        .select("data")
        .eq("user_id", user.id)
        .maybeSingle();

    if (error) {
        console.error("Cloud load failed:", error);
        return null;
    }

    if (!data) {
        return null;
    }

    return data.data;
}
loginBtn.addEventListener("click", async function () {

    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: loginEmail.value,
        password: loginPassword.value
    });

    if (error) {
        alert("Sign in failed: " + error.message);
        return;
    }

alert("Signed in successfully");

loginStatus.textContent =
    "Signed in as: " + data.user.email;
    const cloudData = await loadUserDataFromCloud();

if (cloudData) {

    topics = cloudData.topics || [];
    shapes = cloudData.shapes || {};
    savedConnections = cloudData.connections || {};
    currentTopic = cloudData.currentTopic || null;

    localStorage.setItem(
        "topics",
        JSON.stringify(topics)
    );

    localStorage.setItem(
        "shapes",
        JSON.stringify(shapes)
    );

    localStorage.setItem(
        "connections",
        JSON.stringify(savedConnections)
    );

    if (currentTopic) {
        localStorage.setItem(
            "currentTopic",
            currentTopic
        );
    } else {
        localStorage.removeItem("currentTopic");
    }

    displayTopics();

    if (currentTopic) {
        openTopic(currentTopic);
    }
}
else {
    topics = [];
    shapes = {};
    savedConnections = {};
    currentTopic = null;

    localStorage.removeItem("topics");
localStorage.removeItem("shapes");
localStorage.removeItem("connections");
localStorage.removeItem("currentTopic");

    topicPage.style.display = "none";
    createTopicBtn.style.display = "inline-block";
    topicList.style.display = "block";

    displayTopics();
}
console.log("Signed in user:", data.user);
});
logoutBtn.addEventListener("click", async function () {

    const { error } =
        await supabaseClient.auth.signOut();

    if (error) {
        alert("Sign out failed: " + error.message);
        return;
    }

    alert("Signed out successfully");
    loginStatus.textContent = "Not signed in";
    topics = [];
shapes = {};
savedConnections = {};
currentTopic = null;

localStorage.removeItem("topics");
localStorage.removeItem("shapes");
localStorage.removeItem("connections");
localStorage.removeItem("currentTopic");

topicPage.style.display = "none";
createTopicBtn.style.display = "inline-block";
topicList.style.display = "block";

displayTopics();
window.location.reload();
});
const attachFileBtn = document.getElementById("attachFileBtn");
const attachmentFileInput = document.getElementById("attachmentFileInput");

attachFileBtn.addEventListener("click", function () {
    attachmentFileInput.click();
});
attachmentFileInput.addEventListener("change", async function () {

    const file = attachmentFileInput.files[0];
        if (!selectedShape) {
        alert("Select a shape first.");
        attachmentFileInput.value = "";
        return;
    }

    if (!file) {
        return;
    }

    const {
        data: { user },
        error: userError
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
        alert("Please sign in first.");
        return;
    }

    const filePath =
        user.id + "/" + Date.now() + "-" + file.name;

    const { data, error } = await supabaseClient.storage
        .from("mind-map-files")
        .upload(filePath, file);

    if (error) {
        alert("Upload failed: " + error.message);
        return;
    }
if (!selectedShape.savedData.attachments) {
    selectedShape.savedData.attachments = [];
}

selectedShape.savedData.attachments.push({
    name: file.name,
    path: filePath,
    type: file.type,
    size: file.size
});

localStorage.setItem(
    "shapes",
    JSON.stringify(shapes)
);
let attachmentBadge =
    selectedShape.querySelector(".attachment-badge");

if (!attachmentBadge) {
    attachmentBadge = document.createElement("div");
    attachmentBadge.classList.add("attachment-badge");
    selectedShape.appendChild(attachmentBadge);
}

attachmentBadge.textContent =
    "📎 " + selectedShape.savedData.attachments.length;
   attachmentBadge.addEventListener("mousedown", function (event) {
    event.preventDefault();
    event.stopPropagation();
});

attachmentBadge.addEventListener("click", function (event) {
    event.preventDefault();
    event.stopPropagation();
    showAttachmentPanel(selectedShape);
});
    alert("File uploaded successfully");

    console.log("Uploaded file:", data);
});
const deleteAttachmentBtn =
    document.getElementById("deleteAttachmentBtn");
    deleteAttachmentBtn.addEventListener("click", async function () {

    if (!selectedShape) {
        alert("Select a shape first.");
        return;
    }

    const attachments =
        selectedShape.savedData.attachments || [];

    if (attachments.length === 0) {
        alert("This shape has no attachments.");
        return;
    }

    const attachment = attachments[attachments.length - 1];

    const confirmed = confirm(
        "Delete attachment: " + attachment.name + "?"
    );

    if (!confirmed) {
        return;
    }

    const { error } = await supabaseClient.storage
        .from("mind-map-files")
        .remove([attachment.path]);

    if (error) {
        alert("Delete failed: " + error.message);
        return;
    }

    attachments.pop();

    selectedShape.savedData.attachments = attachments;

    localStorage.setItem(
        "shapes",
        JSON.stringify(shapes)
    );

    alert("Attachment deleted successfully");
});
const attachmentPanel =
    document.getElementById("attachmentPanel");

const attachmentList =
    document.getElementById("attachmentList");
    function showAttachmentPanel(shape) {

    const attachments =
        shape.savedData.attachments || [];

    attachmentList.innerHTML = "";

    attachments.forEach(function (attachment) {

    const row = document.createElement("div");

    const fileName = document.createElement("span");
    fileName.textContent = attachment.name;

    const openBtn = document.createElement("button");
    openBtn.type = "button";
    openBtn.textContent = "Open";
    openBtn.addEventListener("click", async function () {

    const { data, error } = await supabaseClient.storage
        .from("mind-map-files")
        .createSignedUrl(
            attachment.path,
            60 * 60
        );

    if (error) {
        alert("Could not open file: " + error.message);
        return;
    }

    window.open(data.signedUrl, "_blank");
});

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", async function () {

    const confirmed = confirm(
        "Delete attachment: " + attachment.name + "?"
    );

    if (!confirmed) {
        return;
    }

    const { error } = await supabaseClient.storage
        .from("mind-map-files")
        .remove([attachment.path]);

    if (error) {
        alert("Delete failed: " + error.message);
        return;
    }

    const index =
        shape.savedData.attachments.indexOf(attachment);

    if (index !== -1) {
        shape.savedData.attachments.splice(index, 1);
    }

    localStorage.setItem(
        "shapes",
        JSON.stringify(shapes)
    );

    const badge =
        shape.querySelector(".attachment-badge");

    if (badge) {
        if (shape.savedData.attachments.length === 0) {
            badge.remove();
        } else {
            badge.textContent =
                "📎 " + shape.savedData.attachments.length;
        }
    }

    showAttachmentPanel(shape);

    alert("Attachment deleted successfully");
});

    row.appendChild(fileName);
    row.appendChild(openBtn);
    row.appendChild(deleteBtn);

    attachmentList.appendChild(row);
});

    const shapeRect = shape.getBoundingClientRect();

attachmentPanel.style.left =
    window.scrollX + shapeRect.right + 10 + "px";

attachmentPanel.style.top =
    window.scrollY + shapeRect.top + "px";

attachmentPanel.style.display = "block";
}
const closeAttachmentPanelBtn =
    document.getElementById("closeAttachmentPanelBtn");

closeAttachmentPanelBtn.addEventListener("click", function () {
    attachmentPanel.style.display = "none";
});
document.addEventListener("click", function (event) {

    if (
        attachmentPanel.style.display === "block" &&
        !attachmentPanel.contains(event.target) &&
        !event.target.closest(".attachment-badge")
    ) {
        attachmentPanel.style.display = "none";
    }
});
const editHoverBtn =
    document.getElementById("editHoverBtn");

editHoverBtn.addEventListener("click", function () {

    if (!selectedShape) {
        alert("Select a hover symbol first.");
        return;
    }

    if (selectedShape.savedData.type !== "hover") {
        alert("Select a hover symbol first.");
        return;
    }

    const newText = prompt(
        "Enter the text to show on hover:",
        selectedShape.savedData.hoverText || ""
    );

    if (newText === null) {
        return;
    }

    selectedShape.savedData.hoverText = newText;

    localStorage.setItem(
        "shapes",
        JSON.stringify(shapes)
    );

    alert("Hover text saved");
});
const deleteHoverBtn =
    document.getElementById("deleteHoverBtn");

deleteHoverBtn.addEventListener("click", function () {

    if (
        !selectedShape ||
        !selectedShape.savedData ||
        selectedShape.savedData.type !== "hover"
    ) {
        alert("Select an info symbol first.");
        return;
    }

    const shapeToDelete = selectedShape;
    const savedDataToDelete = selectedShape.savedData;

    shapes[currentTopic] =
        (shapes[currentTopic] || []).filter(function (item) {
            return item !== savedDataToDelete;
        });

    localStorage.setItem(
        "shapes",
        JSON.stringify(shapes)
    );

    shapeToDelete.remove();

    if (shapeSelectionOutline) {
        shapeSelectionOutline.remove();
        shapeSelectionOutline = null;
    }

    selectedShape = null;

    if (hoverPopup) {
        hoverPopup.style.display = "none";
    }

    showHoverTools(false);
    showNormalShapeTools(true);
    setSidebarMode("default");

    updateConnections();
});
const hoverPopup =
    document.getElementById("hoverPopup");
    let hoverHideTimer;

function scheduleHoverPopupHide() {
    clearTimeout(hoverHideTimer);

    hoverHideTimer = setTimeout(function () {
        hoverPopup.style.display = "none";
    }, 250);
}

function keepHoverPopupOpen() {
    clearTimeout(hoverHideTimer);
}

hoverPopup.addEventListener("mouseenter", function () {
    keepHoverPopupOpen();
});

hoverPopup.addEventListener("mouseleave", function () {
    scheduleHoverPopupHide();
});
canvas.addEventListener("click", function (event) {

    if (event.target !== canvas) {
        return;
    }

    if (selectedShape) {
    selectedShape.classList.remove("shape-selected");
    selectedShape = null;

    showHoverTools(false);
    showNormalShapeTools(true);
    setSidebarMode("default");
}

    if (shapeSelectionOutline) {
        shapeSelectionOutline.remove();
        shapeSelectionOutline = null;
    }
});
function clearStuckHoverDrag() {
    document
        .querySelectorAll(".dragging-hover")
        .forEach(function (shape) {
            shape.classList.remove("dragging-hover");
        });
}

window.addEventListener("blur", clearStuckHoverDrag);

document.addEventListener("mousemove", function (event) {
    if (event.buttons === 0) {
        clearStuckHoverDrag();
    }
});
const addHoverImageBtn =
    document.getElementById("addHoverImageBtn");

const hoverImageFileInput =
    document.getElementById("hoverImageFileInput");

addHoverImageBtn.addEventListener("click", function () {

    if (
        !selectedShape ||
        selectedShape.savedData.type !== "hover"
    ) {
        alert("Select a hover symbol first.");
        return;
    }

    hoverImageFileInput.click();
});
hoverImageFileInput.addEventListener("change", async function () {

    const file = hoverImageFileInput.files[0];

    if (!file) {
        return;
    }

    if (
        !selectedShape ||
        selectedShape.savedData.type !== "hover"
    ) {
        alert("Select a hover symbol first.");
        hoverImageFileInput.value = "";
        return;
    }

    const {
        data: { user },
        error: userError
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
        alert("Please sign in first.");
        return;
    }

    const filePath =
        user.id +
        "/hover-images/" +
        Date.now() +
        "-" +
        file.name;

  const imageData = await file.arrayBuffer();

const { error } = await supabaseClient.storage
    .from("mind-map-files")
    .upload(filePath, imageData, {
        contentType: file.type
    });

    if (error) {
        alert("Image upload failed: " + error.message);
        return;
    }

    selectedShape.savedData.hoverImage = {
        name: file.name,
        path: filePath,
        type: file.type
    };

    localStorage.setItem(
        "shapes",
        JSON.stringify(shapes)
    );

    hoverImageFileInput.value = "";

    alert("Hover image uploaded successfully");
});
async function showHoverContent(shape, savedData) {

    if (!savedData.hoverText && !savedData.hoverImage) {
        return;
    }

    hoverPopup.innerHTML = "";

    if (savedData.hoverText) {

        const text = document.createElement("div");
        text.textContent = savedData.hoverText;

        hoverPopup.appendChild(text);
    }
if (
    savedData.hoverLinks &&
    savedData.hoverLinks.length > 0
) {

    savedData.hoverLinks.forEach(function (hoverLink) {

        const link = document.createElement("a");

        link.textContent =
            hoverLink.label || "Open link";

        link.href =
            hoverLink.url;

        link.target = "_blank";
        link.rel = "noopener noreferrer";

        link.style.display = "block";
        link.style.marginTop = "8px";

        hoverPopup.appendChild(link);
    });
}
    if (savedData.hoverImage) {

        const { data, error } =
            await supabaseClient.storage
                .from("mind-map-files")
                .createSignedUrl(
                    savedData.hoverImage.path,
                    60 * 60
                );

        if (!error) {

            const image = document.createElement("img");

            image.src = data.signedUrl;

            image.style.maxWidth = "300px";
            image.style.display = "block";
            image.style.marginTop = "10px";
            image.style.borderRadius = "6px";
            image.style.cursor = "zoom-in";

image.addEventListener("click", function () {
    window.open(
        data.signedUrl,
        "_blank",
        "noopener,noreferrer"
    );
});

            hoverPopup.appendChild(image);
            try {
    await image.decode();
} catch (error) {
    // Continue even if the browser cannot decode early
}
        }
    }

    const rect = shape.getBoundingClientRect();

hoverPopup.style.display = "block";

const popupRect =
    hoverPopup.getBoundingClientRect();

let left =
    rect.right + 10;

let top =
    rect.top;

if (
    left + popupRect.width >
    window.innerWidth - 10
) {
    left =
        rect.left -
        popupRect.width -
        10;
}

if (
    top + popupRect.height >
    window.innerHeight - 10
) {
    top =
        window.innerHeight -
        popupRect.height -
        10;
}

if (left < 10) {
    left = 10;
}

if (top < 10) {
    top = 10;
}

hoverPopup.style.left =
    window.scrollX + left + "px";

hoverPopup.style.top =
    window.scrollY + top + "px";
}
const removeHoverImageBtn =
    document.getElementById("removeHoverImageBtn");

removeHoverImageBtn.addEventListener("click", async function () {

    if (
        !selectedShape ||
        selectedShape.savedData.type !== "hover"
    ) {
        alert("Select a hover symbol first.");
        return;
    }

    const hoverImage =
        selectedShape.savedData.hoverImage;

    if (!hoverImage) {
        alert("This hover symbol has no image.");
        return;
    }

    const confirmed = confirm(
        "Remove this hover image?"
    );

    if (!confirmed) {
        return;
    }

    const { error } = await supabaseClient.storage
        .from("mind-map-files")
        .remove([hoverImage.path]);

    if (error) {
        alert("Could not remove image: " + error.message);
        return;
    }

    delete selectedShape.savedData.hoverImage;

    localStorage.setItem(
        "shapes",
        JSON.stringify(shapes)
    );

    hoverPopup.style.display = "none";

    alert("Hover image removed");
});
const addHoverLinkBtn =
    document.getElementById("addHoverLinkBtn");

addHoverLinkBtn.addEventListener("click", function () {

    if (
        !selectedShape ||
        selectedShape.savedData.type !== "hover"
    ) {
        alert("Select a hover symbol first.");
        return;
    }

    const label = prompt(
        "Link text:",
        selectedShape.savedData.hoverLink?.label || ""
    );

    if (label === null) {
        return;
    }

    const url = prompt(
        "Link URL:",
        selectedShape.savedData.hoverLink?.url || "https://"
    );

    if (url === null) {
        return;
    }

    if (!selectedShape.savedData.hoverLinks) {
    selectedShape.savedData.hoverLinks = [];

    if (selectedShape.savedData.hoverLink) {
        selectedShape.savedData.hoverLinks.push(
            selectedShape.savedData.hoverLink
        );

        delete selectedShape.savedData.hoverLink;
    }
}

selectedShape.savedData.hoverLinks.push({
    label: label,
    url: url
});

    localStorage.setItem(
        "shapes",
        JSON.stringify(shapes)
    );

    alert("Hover link saved");
});
const removeHoverLinkBtn =
    document.getElementById("removeHoverLinkBtn");

removeHoverLinkBtn.addEventListener("click", function () {

    if (
        !selectedShape ||
        selectedShape.savedData.type !== "hover"
    ) {
        alert("Select a hover symbol first.");
        return;
    }

    const links =
        selectedShape.savedData.hoverLinks || [];

    if (links.length === 0) {
        alert("This hover symbol has no links.");
        return;
    }

    let message = "Which link do you want to remove?\n\n";

    links.forEach(function (link, index) {
        message +=
            (index + 1) +
            ". " +
            (link.label || "Open link") +
            "\n";
    });

    const choice = prompt(message);

    if (choice === null) {
        return;
    }

    const index =
        parseInt(choice, 10) - 1;

    if (
        isNaN(index) ||
        index < 0 ||
        index >= links.length
    ) {
        alert("Please enter a valid link number.");
        return;
    }

    links.splice(index, 1);

    localStorage.setItem(
        "shapes",
        JSON.stringify(shapes)
    );

    hoverPopup.style.display = "none";

    alert("Hover link removed");
});
const editHoverLinkBtn =
    document.getElementById("editHoverLinkBtn");

editHoverLinkBtn.addEventListener("click", function () {

    if (
        !selectedShape ||
        selectedShape.savedData.type !== "hover"
    ) {
        alert("Select a hover symbol first.");
        return;
    }

    const links =
        selectedShape.savedData.hoverLinks || [];

    if (links.length === 0) {
        alert("This hover symbol has no links.");
        return;
    }

    let message = "Which link do you want to edit?\n\n";

    links.forEach(function (link, index) {
        message +=
            (index + 1) +
            ". " +
            (link.label || "Open link") +
            "\n";
    });

    const choice = prompt(message);

    if (choice === null) {
        return;
    }

    const index =
        parseInt(choice, 10) - 1;

    if (
        isNaN(index) ||
        index < 0 ||
        index >= links.length
    ) {
        alert("Please enter a valid link number.");
        return;
    }

    const link = links[index];

    const newLabel = prompt(
        "Link text:",
        link.label || ""
    );

    if (newLabel === null) {
        return;
    }

    const newUrl = prompt(
        "Link URL:",
        link.url || "https://"
    );

    if (newUrl === null) {
        return;
    }

    link.label = newLabel;
    link.url = newUrl;

    localStorage.setItem(
        "shapes",
        JSON.stringify(shapes)
    );

    hoverPopup.style.display = "none";

    alert("Hover link updated");
});
function showHoverTools(show) {

    const group =
        document.getElementById("hoverToolsGroup");

    if (group) {
        group.style.display =
            show ? "flex" : "none";
    }

    document
        .querySelectorAll(".hover-tool")
        .forEach(function (button) {

            button.style.display =
                show ? "inline-block" : "none";
        });
}
function showNormalShapeTools(show) {

    const toolIds = [
        "colourPicker",
        "borderColourPicker",
        "boldBtn",
        "underlineBtn",
        "fontDecreaseBtn",
        "fontIncreaseBtn",
        "fontColourPicker"
    ];

    toolIds.forEach(function (id) {

        const tool = document.getElementById(id);

        if (tool) {
            tool.style.display =
                show ? "" : "none";
        }
    });
}
function setSidebarMode(mode) {

    const shapeGroup =
        document.getElementById("shapeToolsGroup");

    const textGroup =
        document.getElementById("textToolsGroup");

    const lineGroup =
        document.getElementById("lineToolsGroup");

    const canvasGroup =
        document.getElementById("canvasToolsGroup");

    const infoGroup =
        document.getElementById("hoverToolsGroup");

    shapeGroup.style.display =
        mode === "default" || mode === "shape"
            ? "flex"
            : "none";

    textGroup.style.display =
        mode === "shape"
            ? "flex"
            : "none";

    lineGroup.style.display = "flex";

    infoGroup.style.display =
        mode === "hover"
            ? "flex"
            : "none";

    canvasGroup.style.display = "flex";
}
setSidebarMode("default");
let canvasZoom = 1;

function applyCanvasZoom() {

    canvasZoom = Math.max(
        0.4,
        Math.min(2, canvasZoom)
    );

    canvas.style.zoom = canvasZoom;

    zoomLevel.textContent =
        Math.round(canvasZoom * 100) + "%";
}

zoomOutBtn.addEventListener("click", function () {
    canvasZoom -= 0.1;
    applyCanvasZoom();
});

zoomInBtn.addEventListener("click", function () {
    canvasZoom += 0.1;
    applyCanvasZoom();
});

zoomFitBtn.addEventListener("click", function () {

    const canvasViewport =
        document.getElementById("canvasViewport");

    if (!canvasViewport) {
        return;
    }

    const availableWidth =
        canvasViewport.clientWidth - 20;

    canvasZoom =
        availableWidth / canvas.offsetWidth;

    canvasZoom = Math.max(
        0.4,
        Math.min(1, canvasZoom)
    );

    applyCanvasZoom();

    canvasViewport.scrollLeft = 0;
});
const canvasViewport =
    document.getElementById("canvasViewport");

let canvasPanning = false;
let panStartX = 0;
let panStartScrollLeft = 0;

canvas.addEventListener("pointerdown", function (event) {

    if (event.target !== canvas) {
        return;
    }

    if (!canvasViewport) {
        return;
    }

    canvasPanning = true;

    panStartX = event.clientX;
    panStartScrollLeft = canvasViewport.scrollLeft;

    canvas.style.cursor = "grabbing";
});

window.addEventListener("pointermove", function (event) {

    if (!canvasPanning) {
        return;
    }

    const distanceMoved =
        event.clientX - panStartX;

    canvasViewport.scrollLeft =
        panStartScrollLeft - distanceMoved;
});

window.addEventListener("pointerup", function () {

    if (!canvasPanning) {
        return;
    }

    canvasPanning = false;
    canvas.style.cursor = "";
});
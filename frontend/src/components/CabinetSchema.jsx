import { useEffect, useState, useCallback, useRef } from 'react';
import {
  ReactFlow,
  MiniMap,
  Background,
  BackgroundVariant,
  Controls,
  useNodesState,
  useEdgesState,
  NodeResizer,
  ReactFlowProvider,
  Panel,
} from '@xyflow/react';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import useCabinetStore from '../store/store';
import '@xyflow/react/dist/style.css';
import './CabinetSchema.css';
import { useReactFlow } from 'reactflow';
import axios from 'axios';
import {
  Button,
  IconButton,
  Select,
  MenuItem,
  Paper,
  FormControl,
  InputLabel,
  Tooltip,
  Divider,
  Chip,
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import { FaCopy, FaPaste, FaTrash, FaUpload, FaSave } from "react-icons/fa";
import { FaRotateLeft , FaRotateRight } from "react-icons/fa6";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import SuccessModal from './SuccessModal';

const NODE_TYPES = {
  board: ({ selected, width, height, data }) => (
    <div
      className="node board-node"
      style={{
        width: width,
        height: height,
        transform: `rotate(${data.rotation}deg)`,
        backgroundColor: selected ? '#e3f2fd' : '#fff',
        borderColor: selected ? '#2196f3' : '#333',
      }}
    >
      <NodeResizer color="#2196f3" isVisible={selected} minWidth={40} minHeight={10} />
      <div className="node-label bold">Д</div>
    </div>
  ),
  teacherDesk: ({ selected, width, height, data }) => (
    <div
      className="node teacher-desk-node"
      style={{
        width: width,
        height: height,
        transform: `rotate(${data.rotation}deg)`,
        backgroundColor: selected ? '#ffcdd2' : '#fff',
        borderColor: selected ? '#f44336' : '#333',
      }}
    >
      <NodeResizer color="#f44336" isVisible={selected} minWidth={40} minHeight={30} />
      <div className="node-label bold">П</div>
    </div>
  ),
  window: ({ selected, width, height, data }) => (
    <div
      className="node window-node"
      style={{
        width: width,
        height: height,
        transform: `rotate(${data.rotation}deg)`,
        backgroundColor: selected ? '#c8e6c9' : '#fff',
        borderColor: selected ? '#4caf50' : '#333',
      }}
    >
      <NodeResizer color="#4caf50" isVisible={selected} minWidth={40} minHeight={15} />
      <div className="window-lines">
        <div className="window-line"></div>
        <div className="window-line"></div>
      </div>
      <div className="node-label bold"></div>
    </div>
  ),
  cabinet: ({ selected, width, height, data }) => (
    <div
      className="node cabinet-node"
      style={{
        width: width,
        height: height,
        transform: `rotate(${data.rotation}deg)`,
        backgroundColor: selected ? '#d7ccc8' : '#fff',
        borderColor: selected ? '#795548' : '#333',
      }}
    >
      <NodeResizer color="#795548" isVisible={selected} minWidth={30} minHeight={60} />
      <div className="node-label bold">Ш</div>
    </div>
  ),
  computer: ({ selected, width, height, data }) => (
    <div
      className="node computer-node"
      style={{
        width: width,
        height: height,
        transform: `rotate(${data.rotation}deg)`,
        backgroundColor: selected ? '#e1bee7' : '#fff',
        borderColor: selected ? '#9c27b0' : '#333',
      }}
    >
      <NodeResizer color="#9c27b0" isVisible={selected} minWidth={20} minHeight={20} />
      <div className="node-label bold">ПК</div>
    </div>
  ),
  tv: ({ selected, width, height, data }) => (
    <div
      className="node tv-node"
      style={{
        width: width,
        height: height,
        transform: `rotate(${data.rotation}deg)`,
        backgroundColor: selected ? '#b2dfdb' : '#fff',
        borderColor: selected ? '#009688' : '#333',
      }}
    >
      <NodeResizer color="#009688" isVisible={selected} minWidth={40} minHeight={30} />
      <div className="node-label bold">Т</div>
    </div>
  ),
  socket: ({ selected, width, height, data }) => (
    <div
      className="node socket-node"
      style={{
        width: width,
        height: height,
        transform: `rotate(${data.rotation}deg)`,
        backgroundColor: selected ? '#ffecb3' : '#fff',
        borderColor: selected ? '#ffc107' : '#333',
      }}
    >
      <NodeResizer color="#ffc107" isVisible={selected} minWidth={15} minHeight={15} />
      <div className="socket-circle"></div>
      <div className="node-label bold">Я</div>
    </div>
  ),
  wall: ({ selected, width, height, data }) => (
    <div
      className="node wall-node"
      style={{
        width: width,
        height: height,
        transform: `rotate(${data.rotation}deg)`,
        // borderColor: selected ? '#607d8b' : '#455a64',
        backgroundColor: '#fff',
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16'><line x1='0' y1='0' x2='16' y2='16' stroke='%2300aaff' stroke-width='2'/></svg>")`,
        backgroundSize: '16px 16px',
        backgroundPosition: '0 0',
        border: '2px solid rgb(0, 170, 255) '
      }}
    >
      <NodeResizer color="#607d8b" isVisible={selected} minWidth={20} minHeight={20} />
      <div className="node-label bold"></div>
    </div>
  ),
  studentDesk: ({ selected, width, height, data }) => (
    <div
      className="node student-desk-node"
      style={{
        width: width,
        height: height,
        transform: `rotate(${data.rotation}deg)`,
        backgroundColor: selected ? '#f0f4c3' : '#fff',
        borderColor: selected ? '#cddc39' : '#333',
      }}
    >
      <NodeResizer color="#cddc39" isVisible={selected} minWidth={50} minHeight={30} />
      <div className="node-label bold">У</div>
    </div>
  ),
  studentChair: ({ selected, width, height, data }) => (
    <div
      className="node student-chair-node"
      style={{
        width: width,
        height: height,
        transform: `rotate(${data.rotation}deg)`,
        backgroundColor: selected ? '#f0f4c3' : '#fff',
        border: '2px solid #333',
      }}
    >
      <NodeResizer color="#cddc39" isVisible={selected} minWidth={20} minHeight={20} />
      <div className="node-label bold">У</div>
    </div>
  ),
  teacherChair: ({ selected, width, height, data }) => (
    <div
      className="node teacher-chair-node"
      style={{
        width: width,
        height: height,
        transform: `rotate(${data.rotation}deg)`,
        backgroundColor: selected ? '#ffcdd2' : '#fff',
        border: '2px solid #333',
      }}
    >
      <NodeResizer color="#f44336" isVisible={selected} minWidth={30} minHeight={30} />
      <div className="node-label bold">П</div>
    </div>
  ),
  door: ({ selected, width, height, data }) => (
    <div
      className="node door-node"
      style={{
        width: width,
        height: height,
        transform: `rotate(${data.rotation}deg)`,
        backgroundColor: selected ? '#e0e0e0' : 'rgb(255, 255, 255)',
        borderLeft: '2px solid rgb(0, 170, 255)',
        borderRight: '2px solid rgb(0, 170, 255)',
        borderTop: 'none',
        borderBottom: 'none',
      }}
    >
      <NodeResizer color="#000" isVisible={selected} minWidth={20} minHeight={50} />
    </div>
  ),
};

const ELEMENTS = [
  { type: 'board', label: 'Доска', defaultSize: [120, 25], symbol: 'Д' },
  { type: 'studentDesk', label: 'Парта ученика', defaultSize: [60, 40], symbol: 'У' },
  { type: 'studentChair', label: 'Стул ученика', defaultSize: [30, 30], symbol: 'У' },
  { type: 'teacherDesk', label: 'Стол преподавателя', defaultSize: [80, 50], symbol: 'П' },
  { type: 'teacherChair', label: 'Стул преподавателя', defaultSize: [40, 40], symbol: 'П' },
  { type: 'window', label: 'Окно', defaultSize: [80, 20], symbol: '' },
  { type: 'cabinet', label: 'Шкаф', defaultSize: [40, 80], symbol: 'Ш' },
  { type: 'computer', label: 'Компьютер', defaultSize: [30, 30], symbol: 'ПК' },
  { type: 'tv', label: 'Телевизор', defaultSize: [60, 40], symbol: 'Т' },
  { type: 'socket', label: 'Розетка', defaultSize: [20, 20], symbol: 'Я' },
  { type: 'wall', label: 'Стена', defaultSize: [60, 15], symbol: '' },
  { type: 'door', label: 'Дверь', defaultSize: [30, 60], symbol: 'Д' },
];

const CabinetSchema = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [copiedNodes, setCopiedNodes] = useState([]);
  const { project } = useReactFlow();
  const [isModalOpen, setIsModalOpen] = useState(true);
  

  const {
    cabinets,
    selectedCabinetId,
    isLoading,
    error,
    fetchCabinets,
    selectCabinet,
  } = useCabinetStore();

  // Загрузка кабинетов при монтировании
  useEffect(() => {
    fetchCabinets();
  }, [fetchCabinets]);

  const handleRotation = (direction = 'clockwise') => {
    setNodes(nodes => nodes.map(node => {
      if (!node.selected) return node;
      
      const newRotation = direction === 'clockwise' 
        ? (node.data.rotation + 15) % 360 
        : (node.data.rotation - 15 + 360) % 360;

      const isVertical = Math.abs(newRotation % 180) === 90;
      const originalWidth = node.data.originalWidth;
      const originalHeight = node.data.originalHeight;
      
      return {
        ...node,
        style: { 
          width: isVertical ? originalHeight : originalWidth, 
          height: isVertical ? originalWidth : originalHeight 
        },
        data: { 
          ...node.data, 
          rotation: newRotation,
        },
        position: {
          x: node.position.x - (isVertical ? (originalHeight - originalWidth)/2 : 0),
          y: node.position.y - (isVertical ? (originalWidth - originalHeight)/2 : 0)
        }
      };
    }));
  };

  const { fitView } = useReactFlow();

  const handleSaveToServer = async () => {
    try {
      const container = document.querySelector('.react-flow__viewport');
      
      const width = 1000;
      const height = 800;
  
      const canvas = await html2canvas(container, {
        width: width,
        height: height,
        useCORS: true,
        logging: true,
        scale: 2,
        scrollX: -window.scrollX,
        scrollY: -window.scrollY,
        windowWidth: width,
        windowHeight: height,
        onclone: (clonedDoc) => {
          clonedDoc.querySelector('.react-flow__viewport').style.transform = 'none';
        }
      });
  
      const ctx = canvas.getContext('2d');
      ctx.globalCompositeOperation = 'destination-over';
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
  
      const imageData = canvas.toDataURL('image/png');
      const blob = await fetch(imageData).then(res => res.blob());
      useCabinetStore.getState().saveSchema({ nodes, edges }, blob);

      setIsModalOpen(true);
    } catch (error) {
      alert(`Ошибка сохранения: ${error.message}`);
    }
  };
  
  const importData = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    try {
      const data = JSON.parse(await file.text());
      const validatedNodes = data.nodes.map(node => {
        const element = ELEMENTS.find(e => e.type === node.type);
        const rotation = node.data?.rotation || 0;
        
        // Используем сохраненные размеры или значения по умолчанию
        const width = node.width || node.style?.width || element?.defaultSize?.[0] || 100;
        const height = node.height || node.style?.height || element?.defaultSize?.[1] || 50;
  
        // Получаем оригинальные размеры из данных или вычисляем из текущих размеров
        const originalWidth = node.data?.originalWidth || 
                            (Math.abs(rotation % 180) === 90 ? height : width);
        
        const originalHeight = node.data?.originalHeight || 
                             (Math.abs(rotation % 180) === 90 ? width : height);
  
        return {
          ...node,
          width: width,
          height: height,
          data: {
            label: node.data?.label || '',
            rotation: rotation,
            originalWidth: originalWidth,
            originalHeight: originalHeight
          },
          style: {
            width: width,
            height: height
          }
        };
      });
      
      setNodes(validatedNodes);
      setEdges(data.edges || []);
    } catch (error) {
      alert('Ошибка загрузки файла: ' + error.message);
    }
  };

  const handleCopy = () => {
    const selectedNodes = nodes.filter(node => node.selected);
    if (selectedNodes.length > 0) {
      setCopiedNodes(selectedNodes);
    }
  };
  
  const handlePaste = () => {
    if (copiedNodes.length === 0) return;
  
    const newNodes = copiedNodes.map(node => ({
      ...node,
      id: `${node.type}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      position: {
        x: node.position.x + 20,
        y: node.position.y + 20
      },
      selected: false,
      data: {
        ...node.data,
        originalWidth: node.data.originalWidth,
        originalHeight: node.data.originalHeight
      }
    }));
  
    setNodes(nds => nds.concat(newNodes));
  };

  // Создание нового узла
  const createNode = useCallback((position, type) => {
    const element = ELEMENTS.find((e) => e.type === type);
    return {
      id: `${type}-${Date.now()}`,
      type,
      position,
      data: { 
        label: element.symbol, 
        rotation: 0,
        originalWidth: element.defaultSize[0],
        originalHeight: element.defaultSize[1]
      },
      style: {
        width: element.defaultSize[0],
        height: element.defaultSize[1],
      },
      draggable: true,
    };
  }, []);

  const exportData = () => {
    const data = {
      nodes: nodes.map((node) => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: {
          label: node.data.label,
          rotation: node.data.rotation,
          originalWidth: node.data.originalWidth,
          originalHeight: node.data.originalHeight
        },
        width: node.width,
        height: node.height,
        style: {
          width: node.width,
          height: node.height
        }
      })),
      edges: edges
    };
    
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    saveAs(blob, `schema_${new Date().toISOString().slice(0, 10)}.json`);
  };

  const handleDelete = () => {
    setNodes(nodes => nodes.filter(node => !node.selected));
  };

  // Обработка клика по панели
  const onPaneClick = useCallback(
    (event) => {
      if (!selectedType || !reactFlowWrapper.current) return;
  
      // Получаем позицию мыши относительно viewport React Flow
      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      
      // Конвертируем координаты с учетом текущего масштаба и смещения
      const position = project({ x, y });
  
      const newNode = createNode(position, selectedType);
      setNodes((ns) => ns.concat(newNode));
    },
    [selectedType, createNode, setNodes, project]
  );

  return (
    <div className="cabinet-schema" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={NODE_TYPES}
        onPaneClick={onPaneClick}
        snapToGrid
        snapGrid={[10, 10]}
        fitView={false}
        minZoom={0.1}
        maxZoom={2}
        // fitViewOptions={{
        //   padding: 0.2,
        //   duration: 0,
        //   nodes: nodes.map(n => ({ id: n.id }))
        // }}
        translateExtent={[
          [-Infinity, -Infinity], 
          [Infinity, Infinity]
        ]}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
        <MiniMap />
        <Controls />
        <Panel position="top-left">
  <Paper elevation={3} sx={{ p: 2, maxWidth: 320 }}>
    <ToggleButtonGroup
      orientation="vertical"
      value={selectedType}
      exclusive
      fullWidth
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 1
      }}
    >
      {ELEMENTS.map((item) => (
        <Tooltip key={item.type} title={item.label} arrow>
          <ToggleButton
            value={item.type}
            selected={selectedType === item.type}
            onClick={() => setSelectedType(item.type)}
            sx={{
              height: 60,
              p: 1,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '8px!important',
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'common.white',
                '&:hover': {
                  bgcolor: 'primary.dark'
                }
              }
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center' 
            }}>
              <Chip 
                label={item.symbol}
                size="small" 
                sx={{
                  mb: 0.5,
                  bgcolor: 'transparent',
                  border: '1px solid',
                  borderColor: 'inherit',
                  color: 'inherit'
                }}
              />
              <Typography variant="caption" sx={{ 
                fontSize: '0.65rem', 
                lineHeight: 1.1,
                textAlign: 'center'
              }}>
                {item.label}
              </Typography>
            </Box>
          </ToggleButton>
        </Tooltip>
      ))}
    </ToggleButtonGroup>
  </Paper>
</Panel>
  <Panel position="top-right" >
  <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      <Button
        variant="contained"
        color="primary"
        component="label"
        startIcon={<FaUpload />}
      >
        Загрузить
        <input type="file" hidden onChange={importData} accept=".json" />
      </Button>
      
      <Button
        variant="outlined"
        color="primary"
        startIcon={<FaSave />}
        onClick={exportData}
      >
        Сохранить
      </Button>
    </Box>

    <FormControl fullWidth size="small">
      <InputLabel>Кабинет</InputLabel>
      <Select
        value={selectedCabinetId || ''}
        onChange={(e) => selectCabinet(e.target.value)}
        disabled={isLoading}
        label="Кабинет"
      >
        <MenuItem value="">Выберите кабинет</MenuItem>
        {cabinets.map((cabinet) => (
          <MenuItem key={cabinet._id} value={cabinet._id}>
            Кабинет №{cabinet.cabinet}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <Button
      variant="contained"
        color="primary"
      onClick={handleSaveToServer}
      disabled={!selectedCabinetId || isLoading}
      fullWidth
    >
      {isLoading ? 'Сохранение...' : 'Сохранить на сервере'}
    </Button>

    <Divider sx={{ my: 1 }} />

    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
      <Tooltip title="Повернуть влево">
        <IconButton onClick={() => handleRotation('counterclockwise')} color="primary">
          <FaRotateLeft />
        </IconButton>
      </Tooltip>
      
      <Tooltip title="Повернуть вправо">
        <IconButton onClick={() => handleRotation('clockwise')} color="primary">
          <FaRotateRight />
        </IconButton>
      </Tooltip>
      
      <Tooltip title="Удалить">
        <IconButton onClick={handleDelete} color="error">
          <FaTrash />
        </IconButton>
      </Tooltip>
      
      <Tooltip title="Копировать">
        <IconButton onClick={handleCopy} color="primary">
          <FaCopy />
        </IconButton>
      </Tooltip>
      
      <Tooltip title="Вставить">
        <IconButton onClick={handlePaste} color="primary">
          <FaPaste />
        </IconButton>
      </Tooltip>
    </Box>
  </Paper>
</Panel>

      </ReactFlow>
      {error && (
        <div className="error-message">
          Ошибка: {error}
        </div>
      )}
      <SuccessModal 
  open={isModalOpen}
  onClose={() => setIsModalOpen(false)}
/>
    </div>
  );
};

export default () => (
  <ThemeProvider theme={theme}>
    <ReactFlowProvider>
      <CabinetSchema />
    </ReactFlowProvider>
  </ThemeProvider>
);
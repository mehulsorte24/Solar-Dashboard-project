import type { TelemetryData } from '../types/system';

type MessageHandler = (data: TelemetryData) => void;
type ConnectionHandler = (connected: boolean) => void;

export class RealtimeWebSocketService {
  private ws: WebSocket | null = null;
  private url: string;
  private messageListeners: Set<MessageHandler> = new Set();
  private connectionListeners: Set<ConnectionHandler> = new Set();
  private reconnectTimer: any = null;
  private isConnected: boolean = false;

  constructor(url?: string) {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const defaultHost = window.location.hostname === 'localhost' ? 'localhost:8000' : window.location.host;
    this.url = url || `${wsProtocol}//${defaultHost}/ws/live`;
  }

  public connect(): void {
    if (this.ws && (this.ws.readyState === WebSocket.CONNECTING || this.ws.readyState === WebSocket.OPEN)) {
      return;
    }

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        this.isConnected = true;
        this.notifyConnectionState(true);
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = null;
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const data: TelemetryData = JSON.parse(event.data);
          this.notifyMessage(data);
        } catch (e) {
          console.error('Failed to parse WS message:', e);
        }
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        this.notifyConnectionState(false);
        this.scheduleReconnect();
      };

      this.ws.onerror = (error) => {
        console.warn('WebSocket error:', error);
        this.ws?.close();
      };
    } catch (e) {
      console.error('WebSocket connection attempt failed:', e);
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, 4000);
  }

  public disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  public onMessage(handler: MessageHandler): () => void {
    this.messageListeners.add(handler);
    return () => this.messageListeners.delete(handler);
  }

  public onConnectionChange(handler: ConnectionHandler): () => void {
    this.connectionListeners.add(handler);
    handler(this.isConnected);
    return () => this.connectionListeners.delete(handler);
  }

  private notifyMessage(data: TelemetryData): void {
    this.messageListeners.forEach(listener => listener(data));
  }

  private notifyConnectionState(connected: boolean): void {
    this.connectionListeners.forEach(listener => listener(connected));
  }
}

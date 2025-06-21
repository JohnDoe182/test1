import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SortableTableComponent } from "./sortable-table.component";

interface Route {
  'uuid': string;
  'address': string; //10.1.30.0/24
  'mask': string;
  'gateway': string; //0.0.0.0
  'interface': string;
}
const mockData: Route[] = [
  { uuid: '1', address: '10.1.30.0/24', mask: '255.255.255.0', gateway: '0.0.0.0', interface: 'Гостевая сеть' },
  { uuid: '2', address: '192.168.1.0/24', mask: '255.255.255.0', gateway: '192.168.1.1', interface: 'Домашняя сеть' },
  { uuid: '3', address: '172.16.0.0/16', mask: '255.255.0.0', gateway: '172.16.0.1', interface: 'Подключение Ethernet' },
  { uuid: '4', address: '10.0.0.0/8', mask: '255.0.0.0', gateway: '10.0.0.1', interface: 'Гостевая сеть' },
  { uuid: '5', address: '192.168.0.0/24', mask: '255.255.255.0', gateway: '192.168.0.1', interface: 'Домашняя сеть' },
  { uuid: '6', address: '172.16.1.0/24', mask: '255.255.255.0', gateway: '172.16.1.1', interface: 'Подключение Ethernet' },
  { uuid: '7', address: '10.1.31.0/24', mask: '255.255.255.0', gateway: '0.0.0.0', interface: 'Гостевая сеть' },
  { uuid: '8', address: '192.168.2.0/24', mask: '255.255.255.0', gateway: '192.168.2.1', interface: 'Домашняя сеть' },
  { uuid: '9', address: '172.16.2.0/24', mask: '255.255.255.0', gateway: '172.16.2.1', interface: 'Подключение Ethernet' },
];

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SortableTableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Действующие маршруты IPv4';
  headers = ['Адрес назначения', 'Шлюз', 'Интерфейс'];
  rows: string[][] = mockData.map(route => {
    return [route.address, route.mask, route.interface];
  });
}

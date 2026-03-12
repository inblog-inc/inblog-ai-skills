export interface Adapter {
  name: string;
  install(projectDir: string, contentDir: string): Promise<void>;
}

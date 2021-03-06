"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONTransformer = void 0;
const as_1 = require("visitor-as/as");
const JSONBuilder_1 = require("./JSONBuilder");
const typeChecker_1 = require("./typeChecker");
class JSONTransformer extends as_1.Transform {
    afterParse(parser) {
        this.parser = parser;
        const writeFile = this.writeFile;
        const baseDir = this.baseDir;
        let newParser = new as_1.Parser(parser.diagnostics);
        // Filter for near files
        let files = JSONBuilder_1.JSONBindingsBuilder.nearFiles(this.parser.sources);
        JSONTransformer.isTest = files
            .map((source) => source.normalizedPath)
            .some((path) => path.includes("spec"));
        // Visit each file
        files.forEach((source) => {
            let writeOut = /\/\/.*@nearfile .*out/.test(source.text);
            // Remove from logs in parser
            parser.donelog.delete(source.internalPath);
            parser.seenlog.delete(source.internalPath);
            // Remove from programs sources
            this.parser.sources = this.parser.sources.filter((_source) => _source !== source);
            this.program.sources = this.program.sources.filter((_source) => _source !== source);
            // Build new Source
            let sourceText = JSONBuilder_1.JSONBindingsBuilder.build(source);
            if (writeOut) {
                writeFile("out/" + source.normalizedPath, sourceText, baseDir);
            }
            // Parses file and any new imports added to the source
            newParser.parseFile(sourceText, (JSONBuilder_1.isEntry(source) ? "" : "./") + source.normalizedPath, JSONBuilder_1.isEntry(source));
            let newSource = newParser.sources.pop();
            this.program.sources.push(newSource);
            parser.donelog.add(source.internalPath);
            parser.seenlog.add(source.internalPath);
            parser.sources.push(newSource);
        });
        if (!JSONTransformer.isTest) {
            typeChecker_1.TypeChecker.check(parser);
        }
    }
    /** Check for floats */
    afterCompile(module) {
        if (!JSONTransformer.isTest) {
            typeChecker_1.TypeChecker.checkBinary(module);
        }
    }
}
exports.JSONTransformer = JSONTransformer;
JSONTransformer.isTest = false;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdHJhbnNmb3JtZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsc0NBQWtFO0FBQ2xFLCtDQUE2RDtBQUM3RCwrQ0FBNEM7QUFFNUMsTUFBTSxlQUFnQixTQUFRLGNBQVM7SUFJckMsVUFBVSxDQUFDLE1BQWM7UUFDdkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUNqQyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQzdCLElBQUksU0FBUyxHQUFHLElBQUksV0FBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUUvQyx3QkFBd0I7UUFDeEIsSUFBSSxLQUFLLEdBQUcsaUNBQW1CLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDL0QsZUFBZSxDQUFDLE1BQU0sR0FBRyxLQUFLO2FBQzNCLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQzthQUN0QyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUN6QyxrQkFBa0I7UUFDbEIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO1lBQ3ZCLElBQUksUUFBUSxHQUFHLHVCQUF1QixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDekQsNkJBQTZCO1lBQzdCLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUMzQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDM0MsK0JBQStCO1lBQy9CLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FDOUMsQ0FBQyxPQUFlLEVBQUUsRUFBRSxDQUFDLE9BQU8sS0FBSyxNQUFNLENBQ3hDLENBQUM7WUFDRixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQ2hELENBQUMsT0FBZSxFQUFFLEVBQUUsQ0FBQyxPQUFPLEtBQUssTUFBTSxDQUN4QyxDQUFDO1lBQ0YsbUJBQW1CO1lBQ25CLElBQUksVUFBVSxHQUFHLGlDQUFtQixDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNuRCxJQUFJLFFBQVEsRUFBRTtnQkFDWixTQUFTLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxjQUFjLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDO2FBQ2hFO1lBQ0Qsc0RBQXNEO1lBQ3RELFNBQVMsQ0FBQyxTQUFTLENBQ2pCLFVBQVUsRUFDVixDQUFDLHFCQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLGNBQWMsRUFDckQscUJBQU8sQ0FBQyxNQUFNLENBQUMsQ0FDaEIsQ0FBQztZQUNGLElBQUksU0FBUyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFHLENBQUM7WUFDekMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3JDLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUN4QyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDeEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDakMsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRTtZQUMzQix5QkFBVyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUMzQjtJQUNILENBQUM7SUFFRCx1QkFBdUI7SUFDdkIsWUFBWSxDQUFDLE1BQWM7UUFDekIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUU7WUFDM0IseUJBQVcsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDakM7SUFDSCxDQUFDOztBQUdNLDBDQUFlO0FBekRmLHNCQUFNLEdBQVksS0FBSyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVHJhbnNmb3JtLCBQYXJzZXIsIFNvdXJjZSwgTW9kdWxlIH0gZnJvbSBcInZpc2l0b3ItYXMvYXNcIjtcbmltcG9ydCB7IEpTT05CaW5kaW5nc0J1aWxkZXIsIGlzRW50cnkgfSBmcm9tIFwiLi9KU09OQnVpbGRlclwiO1xuaW1wb3J0IHsgVHlwZUNoZWNrZXIgfSBmcm9tIFwiLi90eXBlQ2hlY2tlclwiO1xuXG5jbGFzcyBKU09OVHJhbnNmb3JtZXIgZXh0ZW5kcyBUcmFuc2Zvcm0ge1xuICBwYXJzZXI6IFBhcnNlcjtcbiAgc3RhdGljIGlzVGVzdDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGFmdGVyUGFyc2UocGFyc2VyOiBQYXJzZXIpOiB2b2lkIHtcbiAgICB0aGlzLnBhcnNlciA9IHBhcnNlcjtcbiAgICBjb25zdCB3cml0ZUZpbGUgPSB0aGlzLndyaXRlRmlsZTtcbiAgICBjb25zdCBiYXNlRGlyID0gdGhpcy5iYXNlRGlyO1xuICAgIGxldCBuZXdQYXJzZXIgPSBuZXcgUGFyc2VyKHBhcnNlci5kaWFnbm9zdGljcyk7XG5cbiAgICAvLyBGaWx0ZXIgZm9yIG5lYXIgZmlsZXNcbiAgICBsZXQgZmlsZXMgPSBKU09OQmluZGluZ3NCdWlsZGVyLm5lYXJGaWxlcyh0aGlzLnBhcnNlci5zb3VyY2VzKTtcbiAgICBKU09OVHJhbnNmb3JtZXIuaXNUZXN0ID0gZmlsZXNcbiAgICAgIC5tYXAoKHNvdXJjZSkgPT4gc291cmNlLm5vcm1hbGl6ZWRQYXRoKVxuICAgICAgLnNvbWUoKHBhdGgpID0+IHBhdGguaW5jbHVkZXMoXCJzcGVjXCIpKTtcbiAgICAvLyBWaXNpdCBlYWNoIGZpbGVcbiAgICBmaWxlcy5mb3JFYWNoKChzb3VyY2UpID0+IHtcbiAgICAgIGxldCB3cml0ZU91dCA9IC9cXC9cXC8uKkBuZWFyZmlsZSAuKm91dC8udGVzdChzb3VyY2UudGV4dCk7XG4gICAgICAvLyBSZW1vdmUgZnJvbSBsb2dzIGluIHBhcnNlclxuICAgICAgcGFyc2VyLmRvbmVsb2cuZGVsZXRlKHNvdXJjZS5pbnRlcm5hbFBhdGgpO1xuICAgICAgcGFyc2VyLnNlZW5sb2cuZGVsZXRlKHNvdXJjZS5pbnRlcm5hbFBhdGgpO1xuICAgICAgLy8gUmVtb3ZlIGZyb20gcHJvZ3JhbXMgc291cmNlc1xuICAgICAgdGhpcy5wYXJzZXIuc291cmNlcyA9IHRoaXMucGFyc2VyLnNvdXJjZXMuZmlsdGVyKFxuICAgICAgICAoX3NvdXJjZTogU291cmNlKSA9PiBfc291cmNlICE9PSBzb3VyY2VcbiAgICAgICk7XG4gICAgICB0aGlzLnByb2dyYW0uc291cmNlcyA9IHRoaXMucHJvZ3JhbS5zb3VyY2VzLmZpbHRlcihcbiAgICAgICAgKF9zb3VyY2U6IFNvdXJjZSkgPT4gX3NvdXJjZSAhPT0gc291cmNlXG4gICAgICApO1xuICAgICAgLy8gQnVpbGQgbmV3IFNvdXJjZVxuICAgICAgbGV0IHNvdXJjZVRleHQgPSBKU09OQmluZGluZ3NCdWlsZGVyLmJ1aWxkKHNvdXJjZSk7XG4gICAgICBpZiAod3JpdGVPdXQpIHtcbiAgICAgICAgd3JpdGVGaWxlKFwib3V0L1wiICsgc291cmNlLm5vcm1hbGl6ZWRQYXRoLCBzb3VyY2VUZXh0LCBiYXNlRGlyKTtcbiAgICAgIH1cbiAgICAgIC8vIFBhcnNlcyBmaWxlIGFuZCBhbnkgbmV3IGltcG9ydHMgYWRkZWQgdG8gdGhlIHNvdXJjZVxuICAgICAgbmV3UGFyc2VyLnBhcnNlRmlsZShcbiAgICAgICAgc291cmNlVGV4dCxcbiAgICAgICAgKGlzRW50cnkoc291cmNlKSA/IFwiXCIgOiBcIi4vXCIpICsgc291cmNlLm5vcm1hbGl6ZWRQYXRoLFxuICAgICAgICBpc0VudHJ5KHNvdXJjZSlcbiAgICAgICk7XG4gICAgICBsZXQgbmV3U291cmNlID0gbmV3UGFyc2VyLnNvdXJjZXMucG9wKCkhO1xuICAgICAgdGhpcy5wcm9ncmFtLnNvdXJjZXMucHVzaChuZXdTb3VyY2UpO1xuICAgICAgcGFyc2VyLmRvbmVsb2cuYWRkKHNvdXJjZS5pbnRlcm5hbFBhdGgpO1xuICAgICAgcGFyc2VyLnNlZW5sb2cuYWRkKHNvdXJjZS5pbnRlcm5hbFBhdGgpO1xuICAgICAgcGFyc2VyLnNvdXJjZXMucHVzaChuZXdTb3VyY2UpO1xuICAgIH0pO1xuXG4gICAgaWYgKCFKU09OVHJhbnNmb3JtZXIuaXNUZXN0KSB7XG4gICAgICBUeXBlQ2hlY2tlci5jaGVjayhwYXJzZXIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBDaGVjayBmb3IgZmxvYXRzICovXG4gIGFmdGVyQ29tcGlsZShtb2R1bGU6IE1vZHVsZSk6IHZvaWQge1xuICAgIGlmICghSlNPTlRyYW5zZm9ybWVyLmlzVGVzdCkge1xuICAgICAgVHlwZUNoZWNrZXIuY2hlY2tCaW5hcnkobW9kdWxlKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IHsgSlNPTlRyYW5zZm9ybWVyIH07XG4iXX0=
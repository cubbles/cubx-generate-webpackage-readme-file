## {{wpName}}
{{wpDescription}}
### Webpackage Artifacts
| Name | Type | Description | Links |
|---|---|---|---|
{{#artifacts}}
| **{{artifactId}}** | {{type}} | {{description}} | {{#runnables}}[{{name}}]({{&url}}{{&path}}) {{/runnables}}|
{{/artifacts}}
{{#includeSample}}
### Use of components
The html file should contain the desire component using its tag, e.g. the `<{{sampleArtifactId}}>`, as follows:
```html
<{{sampleArtifactId}} cubx-webpackage-id="{{wpName}}@{{wpVersion}}"></{{sampleArtifactId}}>
```
Note that the `webpackageId` should be provided as attribute, which in this case is: `{{wpName}}@{{wpVersion}}`.

{{#includeInit}}
Additionally, this component can be initialized using the `<cubx-core-slot-init>` tag (available from _cubx.core.rte@1.9.0_).
For example, lets initialize the `{{sampleSlotName}}` slot to get the basic package of ckeditor:

```html
<{{sampleArtifactId}} cubx-webpackage-id="{{wpName}}@{{wpVersion}}">
    <!--Initilization-->
    <cubx-core-init style="display:none">
        <cubx-core-slot-init slot="{{sampleSlotName}}">{{&sampleSlotValue}}</cubx-core-slot-init>
    </cubx-core-init>
</{{sampleArtifactId}}>
```

Or it can be initialized and later manipulated from Javascript as follows:

```javascript
var component= document.querySelector('{{sampleArtifactId}}');
// Wait until CIF is ready
document.addEventListener('cifReady', function() {
  // Manipulate slots
  component.{{sampleSlotSetMethod}}({{&sampleSlotValue}});
});
```
{{/includeInit}}
{{/includeSample}}

[Want to get to know the Cubbles Platform?](https://cubbles.github.io)